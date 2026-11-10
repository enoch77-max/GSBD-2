const { chromium } = require('playwright');
const fs = require('fs');

const PAGES = [
  ['home', '/'],
  ['catalog', '/products'],
  ['cat-liion', '/products?category=li-ion-cells'],
  ['cat-bms', '/products?category=bms-protection'],
  ['pdp-cell', '/products/samsung-inr18650-30q-3000mah'],
  ['pdp-bms', '/products/jbd-smart-bms-4s-100a'],
  ['pdp-pack', '/products/lifepo4-12v-100ah-ips-pack'],
  ['pdp-custom', '/products/custom-battery-pack-builder'],
  ['builder', '/pack-builder'],
  ['wishlist', '/wishlist'],
  ['track', '/track'],
  ['help-shipping', '/help/shipping'],
  ['help-warranty', '/help/warranty'],
  ['help-safety', '/help/battery-safety'],
  ['help-wholesale', '/help/wholesale'],
  ['checkout', '/checkout'],
  ['order', '/orders/GS6IF87286'],
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const d = await b.newContext({ viewport: { width: 1366, height: 900 } });

  for (const [name, url] of PAGES) {
    // Mobile: extract text + screenshot (viewport only)
    const mp = await m.newPage();
    await mp.goto('http://localhost:3077' + url, { waitUntil: 'networkidle' });
    await mp.waitForTimeout(700);
    const text = await mp.evaluate(() => {
      const el = document.body;
      return el.innerText.replace(/\n{3,}/g, '\n\n').trim();
    });
    fs.writeFileSync(`/app/_shots/crawl/${name}.txt`, text);
    await mp.screenshot({ path: `/app/_shots/crawl/${name}-m.png` });
    await mp.close();

    // Desktop: screenshot full page (with scroll to trigger reveals)
    const dp = await d.newPage();
    await dp.goto('http://localhost:3077' + url, { waitUntil: 'networkidle' });
    await dp.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await dp.waitForTimeout(900);
    await dp.screenshot({ path: `/app/_shots/crawl/${name}-d.png`, fullPage: true });
    await dp.close();
    console.log('done', name);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
