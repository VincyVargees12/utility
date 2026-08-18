const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const browserDir = path.resolve(__dirname, '..', 'dist', 'frontend', 'browser');

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (entry.name === 'index.html' || entry.name === 'index.csr.html') {
      results.push(fullPath);
    }
  }
  return results;
}

// Add a content hash to styles.css for proper cache-busting.
// With inject:false, Angular doesn't hash the CSS bundle automatically.
// Every prerendered route gets its own index.html with its own <head>,
// so the styles.css reference must be patched in all of them, not just the root.
const stylesPath = path.join(browserDir, 'styles.css');
if (fs.existsSync(stylesPath)) {
  const cssBytes = fs.readFileSync(stylesPath);
  const hash = crypto.createHash('sha256').update(cssBytes).digest('hex').substring(0, 8);
  const hashedName = `styles.${hash}.css`;
  fs.renameSync(stylesPath, path.join(browserDir, hashedName));

  const htmlFiles = findHtmlFiles(browserDir);
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const patched = html.replace(/href="styles\.css"/g, `href="${hashedName}"`);
    if (patched !== html) {
      fs.writeFileSync(file, patched);
    }
  }
  console.log(`Cache-busted styles: styles.css → ${hashedName} (patched ${htmlFiles.length} html files)`);
} else {
  console.log('No styles.css found to cache-bust — skipping.');
}

// Flatten per-route "<route>/index.html" directories into flat "<route>.html" files.
// Angular's static output mode writes one directory + index.html per prerendered route
// (e.g. categories/pdf/merge-pdf/index.html), which only resolves without a redirect if
// the URL has a trailing slash — in conflict with our canonical URLs and
// staticwebapp.config.json's "trailingSlash": "never", which expect no trailing slash.
// Collapsing each route directory into a sibling flat file (categories/pdf/merge-pdf.html)
// lets the routes generated below target a concrete file instead of a directory.
// The root index.html/index.csr.html are left alone since "/" always maps to index.html.
let flattenedCount = 0;
function flattenRouteDirs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      flattenRouteDirs(path.join(dir, entry.name));
    }
  }

  if (dir === browserDir) return;

  const indexPath = path.join(dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    fs.renameSync(indexPath, `${dir}.html`);
    flattenedCount++;
  }

  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
}

flattenRouteDirs(browserDir);
console.log(`Flattened ${flattenedCount} route director${flattenedCount === 1 ? 'y' : 'ies'} into flat .html files.`);

// Generate an explicit "routes" rewrite for every flattened page.
// Verified against the Azure Static Web Apps CLI emulator: unlike some static hosts,
// Azure does NOT auto-append ".html" to an extensionless request. Without an explicit
// route/rewrite pair, "/about" falls through to navigationFallback and silently serves
// the generic CSR shell instead of about.html — which is exactly the bug this fixes.
const configPath = path.join(browserDir, 'staticwebapp.config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.routes = config.routes || [];
  const existingRoutes = new Set(config.routes.map(r => r.route));
  const rootIndexPath = path.join(browserDir, 'index.html');
  const rootCsrPath = path.join(browserDir, 'index.csr.html');
  let addedCount = 0;

  function collectHtmlRoutes(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectHtmlRoutes(fullPath);
      } else if (entry.name.endsWith('.html') && fullPath !== rootIndexPath && fullPath !== rootCsrPath) {
        const relative = path.relative(browserDir, fullPath).split(path.sep).join('/');
        const route = '/' + relative.slice(0, -'.html'.length);
        if (!existingRoutes.has(route)) {
          config.routes.push({ route, rewrite: '/' + relative });
          existingRoutes.add(route);
          addedCount++;
        }
      }
    }
  }

  collectHtmlRoutes(browserDir);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Added ${addedCount} explicit route rewrite(s) to staticwebapp.config.json.`);
} else {
  console.log('No staticwebapp.config.json found in output — skipping route generation.');
}
