const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  try {
    const htmlPath = path.resolve(__dirname, '..', 'evidence', 'top_notifications.html');
    if (!fs.existsSync(htmlPath)) {
      console.error('Missing file:', htmlPath);
      process.exitCode = 2;
      return;
    }

    const outPng = path.resolve(__dirname, '..', 'evidence', 'top_notifications.png');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outPng, fullPage: true });
    await browser.close();
    console.log('Screenshot saved to', outPng);
  } catch (err) {
    console.error('Error generating screenshot:', err);
    process.exitCode = 1;
  }
})();
