const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p = await m.newPage();
  await p.goto('http://localhost:3077/orders/GS6IF87286', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const el = await p.$('h2:has-text("Items")');
  const box = await el.boundingBox();
  await p.screenshot({ path: '/app/public/_shots/z1-order-item.png', fullPage: true, clip: { x: 0, y: box.y - 20, width: 390, height: 320 } });
  const items = await p.$$eval('ul li', els => els.map(e => e.innerText).slice(0, 3));
  console.log(JSON.stringify(items, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
