const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1100 } });
  const page = await context.newPage();
  page.on('console', (m) => console.log('CONSOLE:', m.type(), m.text()));
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  await page.goto('http://localhost:4200/categories/images/remove-background', { waitUntil: 'networkidle' });
  const fileInput = await page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(['C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/test.jpg']);
  await page.waitForSelector('app-tool-sidebar', { timeout: 120000 });
  await page.waitForTimeout(1000);

  const info = await page.evaluate(() => {
    const img = document.querySelector('.checkerboard-bg img');
    return img ? { src: img.src.slice(0, 60), naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, complete: img.complete } : 'no img found';
  });
  console.log('IMG INFO (transparent):', JSON.stringify(info));

  await page.click('button:has-text("Color")');
  await page.waitForTimeout(200);
  const swatches = page.locator('button[style*="background-color"]');
  await swatches.nth(2).click();
  await page.waitForTimeout(1000);

  const info2 = await page.evaluate(() => {
    const img = document.querySelector('.checkerboard-bg img');
    return img ? { src: img.src.slice(0, 60), naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, complete: img.complete } : 'no img found';
  });
  console.log('IMG INFO (color):', JSON.stringify(info2));

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
