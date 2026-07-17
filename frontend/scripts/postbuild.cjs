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
