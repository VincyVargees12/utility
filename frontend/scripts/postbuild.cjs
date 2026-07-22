const fs = require('fs');
const path = require('path');

const browserDir = path.resolve(__dirname, '..', 'dist', 'frontend', 'browser');
const sourceFile = path.join(browserDir, 'index.csr.html');
const targetFile = path.join(browserDir, 'index.html');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`Created ${path.relative(process.cwd(), targetFile)}`);
} else if (fs.existsSync(targetFile)) {
  console.log(`Found existing ${path.relative(process.cwd(), targetFile)}`);
} else {
  throw new Error(`Expected Angular build output at ${sourceFile} but it was not found.`);
}

// Add a content hash to styles.css for proper cache-busting.
// With inject:false, Angular doesn't hash the CSS bundle automatically.
const crypto = require('crypto');
const stylesPath = path.join(browserDir, 'styles.css');
if (fs.existsSync(stylesPath)) {
  const cssBytes = fs.readFileSync(stylesPath);
  const hash = crypto.createHash('sha256').update(cssBytes).digest('hex').substring(0, 8);
  const hashedName = `styles.${hash}.css`;
  fs.renameSync(stylesPath, path.join(browserDir, hashedName));
  let html = fs.readFileSync(targetFile, 'utf8');
  html = html.replace(/href="styles\.css"/g, `href="${hashedName}"`);
  fs.writeFileSync(targetFile, html);
  console.log(`Cache-busted styles: styles.css → ${hashedName}`);
}
