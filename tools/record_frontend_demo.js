const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const url = process.env.FRONTEND_URL || 'http://localhost:3000';
    const out1 = path.resolve(__dirname, '..', 'evidence', 'frontend_demo_step1.png');
    const out2 = path.resolve(__dirname, '..', 'evidence', 'frontend_demo_step2.png');

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    // initial screenshot
    await page.screenshot({ path: out1, fullPage: true });

    // click the Load sample inbox button (safe DOM approach)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const load = btns.find(b => b.textContent && b.textContent.includes('Load sample inbox'));
      if (load) load.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // click the Toggle Inbox button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const toggle = btns.find(b => b.textContent && b.textContent.includes('Toggle Inbox'));
      if (toggle) toggle.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({ path: out2, fullPage: true });
    await browser.close();
    console.log('Saved demo screenshots to', out1, out2);
  } catch (err) {
    console.error('Demo recording failed:', err);
    process.exitCode = 1;
  }
})();
