const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const d = await b.newContext({ viewport: { width: 1366, height: 900 } });
  const p = await d.newPage();
  await p.goto('http://localhost:3077/', { waitUntil: 'networkidle' });
  // scroll to trigger reveals
  await p.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1600);
  await p.screenshot({ path: '/app/_shots/h-d-home-full.png', fullPage: true });
  await b.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
