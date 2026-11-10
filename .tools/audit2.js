const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const S = '/app/public/_shots/';
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p = await m.newPage();
  // add item then checkout
  await p.goto('http://localhost:3077/products/samsung-inr18650-30q-3000mah', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, 600));
  await p.waitForTimeout(400);
  await p.click('button:has-text("Add")'); // sticky bar Add
  await p.click('#cart-button'); await p.waitForTimeout(600);
  await p.screenshot({ path: S + 'b1-m-cart.png' });
  await p.click('text=Checkout securely'); await p.waitForURL('**/checkout');
  await p.waitForTimeout(800);
  await p.screenshot({ path: S + 'b2-m-checkout-empty.png' });
  await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(500);
  await p.screenshot({ path: S + 'b3-m-checkout-pay.png' });
  await b.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
