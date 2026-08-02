const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1100 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('http://localhost:4200/categories/images/remove-background', { waitUntil: 'networkidle' });
  const fileInput = await page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(['C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/test.jpg']);
  await page.waitForSelector('app-tool-sidebar', { timeout: 120000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/rmbg-1-transparent.png' });

  // switch to color tab
  await page.click('button:has-text("Color")');
  await page.waitForTimeout(300);
  const swatches = page.locator('button[style*="background-color"]');
  await swatches.nth(2).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/rmbg-2-color.png' });

  // switch to blur tab
  await page.click('button:has-text("Blur")');
  await page.waitForTimeout(300);
  await page.fill('input[type="range"]', '30');
  await page.dispatchEvent('input[type="range"]', 'change');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/rmbg-3-blur.png' });

  // switch to custom image tab
  await page.click('button:has-text("Custom")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/rmbg-4-custom-empty.png' });

  // back to transparent, then download
  await page.click('button:has-text("None")');
  await page.waitForTimeout(400);

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }),
    page.click('button:has-text("Download image")'),
  ]);
  console.log('Downloaded:', download.suggestedFilename());
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/49c5c9a6-0fa0-42b1-b9ae-90835d425b6c/scratchpad/rmbg-5-complete.png' });

  console.log('ERRORS:', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
