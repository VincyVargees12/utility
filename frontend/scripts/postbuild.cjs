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
