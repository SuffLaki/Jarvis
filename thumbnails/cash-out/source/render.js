const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  for (const f of process.argv.slice(2)) {
    await p.goto('file://' + __dirname + '/' + f + '.html');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.screenshot({ path: f + '.png' });
    console.log('rendered', f);
  }
  await b.close();
})();
