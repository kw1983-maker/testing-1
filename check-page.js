import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.toString()));
  page.on('requestfailed', req => console.log('FAILED:', req.url(), req.failure()?.errorText));

  // Also catch network errors properly
  page.on('response', response => {
    if (!response.ok()) {
      console.log('404 or NOT OK:', response.url(), response.status());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot.png' });
  console.log('DONE!');
  await browser.close();
})();
