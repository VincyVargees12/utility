import { chromium } from 'playwright';

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(String(err)));

await page.goto('http://localhost:4213/categories/developer/json-formatter', { waitUntil: 'networkidle' });
await page.waitForSelector('text=JSON Formatter', { timeout: 15000 });
await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/6a48085a-4895-4c41-910d-fdef08738e85/scratchpad/top.png' });

await page.locator('text=What is JSON?').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/6a48085a-4895-4c41-910d-fdef08738e85/scratchpad/resource-top.png' });

await page.locator('text=Common JSON Errors').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/6a48085a-4895-4c41-910d-fdef08738e85/scratchpad/errors-examples.png' });

await page.locator('text=Frequently Asked Questions').scrollIntoViewIfNeeded();
const firstFaq = page.locator('details summary').first();
await firstFaq.click();
await page.screenshot({ path: 'C:/Users/vincy/AppData/Local/Temp/claude/d--websites-utility/6a48085a-4895-4c41-910d-fdef08738e85/scratchpad/faq.png' });

console.log('CONSOLE_ERRORS:', JSON.stringify(errors));
await browser.close();
