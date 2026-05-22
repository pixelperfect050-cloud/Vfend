const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://brandrocket-ebon.vercel.app/login');
  await page.fill('input[type="email"]', 'demo@brandrocket.com');
  await page.fill('input[type="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**');
  const response = await page.goto('https://brandrocket-ebon.vercel.app/dashboard/intelligence');
  console.log('Status Code:', response.status());
  await page.screenshot({ path: 'scratch/logged-in-test.png' });
  await browser.close();
})();
