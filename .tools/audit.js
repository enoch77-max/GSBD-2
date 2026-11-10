const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const S = '/app/public/_shots/';

  const shot = async (ctx, path, url, opts = {}) => {
    const p = await ctx.newPage();
    await p.goto('http://localhost:3077' + url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    if (opts.scroll) { await p.evaluate(y => window.scrollTo(0, y), opts.scroll); await p.waitForTimeout(500); }
    await p.screenshot({ path: S + path, fullPage: !!opts.full });
    if (opts.click) { await p.click(opts.click); await p.waitForTimeout(900); await p.screenshot({ path: S + path.replace('.png','-after.png') }); }
    await p.close();
  };

  const m390 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  await shot(m390, 'a1-m-home.png', '/');
  await shot(m390, 'a2-m-cat.png', '/products');
  await shot(m390, 'a3-m-cat-bms.png', '/products?category=bms-protection');
  await shot(m390, 'a4-m-pdp-top.png', '/products/samsung-inr18650-30q-3000mah');
  await shot(m390, 'a5-m-pdp-mid.png', '/products/samsung-inr18650-30q-3000mah', { scroll: 650 });
  await shot(m390, 'a6-m-pdp-reviews.png', '/products/samsung-inr18650-30q-3000mah', { scroll: 1500 });
  await shot(m390, 'a7-m-checkout.png', '/checkout');

  const m320 = await b.newContext({ viewport: { width: 320, height: 700 }, isMobile: true });
  await shot(m320, 'a8-m320-home.png', '/');
  await shot(m320, 'a9-m320-cat.png', '/products');

  const d = await b.newContext({ viewport: { width: 1366, height: 900 } });
  await shot(d, 'a10-d-home.png', '/', { full: true });
  await shot(d, 'a11-d-pdp.png', '/products/jbd-smart-bms-4s-100a');
  await shot(d, 'a12-d-builder.png', '/pack-builder');
  await shot(d, 'a13-d-checkout.png', '/checkout');

  const p = await d.newPage();
  await p.goto('http://localhost:3077/products/jbd-smart-bms-4s-100a', { waitUntil: 'networkidle' });
  await p.click('button:has-text("Add to cart")');
  await p.waitForTimeout(400);
  await p.click('#cart-button');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: S + 'a14-d-cart.png' });
  await p.close();

  const pm = await m390.newPage();
  await pm.goto('http://localhost:3077/products?category=tools', { waitUntil: 'networkidle' });
  await pm.click('button[aria-label="Add to cart"] >> nth=0');
  await pm.click('#cart-button'); await pm.waitForTimeout(500);
  await pm.click('text=Checkout securely'); await pm.waitForURL('**/checkout');
  await pm.fill('input[placeholder="e.g. Tanvir Ahmed"]', 'Audit User');
  await pm.fill('input[placeholder="01XXXXXXXXX"]', '01811112222');
  await pm.fill('input[placeholder="House, Road, Block / Village, Post Office"]', 'House 5, Road 9, Dhanmondi');
  await pm.click('button:has-text("Place order")');
  await pm.waitForURL('**/orders/**', { timeout: 20000 });
  await pm.waitForTimeout(2600);
  await pm.screenshot({ path: S + 'a15-m-order.png', fullPage: true });
  console.log('order:', pm.url());
  await pm.close();

  await b.close();
  console.log('audit shots done');
})().catch(e => { console.error(e); process.exit(1); });
