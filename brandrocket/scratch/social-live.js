const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  
  console.log('Navigating to live login page...');
  await p.goto('https://brandrocket-ebon.vercel.app/login');
  await p.fill('#email', 'demo@brandrocket.com');
  await p.fill('#password', 'demo1234');
  await p.click('button[type="submit"]');
  
  console.log('Waiting for redirect...');
  await p.waitForURL('**/dashboard**', { timeout: 15000 });
  console.log('Logged in! URL:', p.url());
  
  console.log('Navigating to live social page...');
  await p.goto('https://brandrocket-ebon.vercel.app/dashboard/social');
  await p.waitForTimeout(3000);
  console.log('Social URL:', p.url());
  
  const has404 = await p.evaluate(() => document.body.innerText.includes('404'));
  console.log('Has 404:', has404);
  
  await p.screenshot({ path: 'scratch/social-live-logged-in.png' });
  await b.close();
})();
