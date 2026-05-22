const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  
  await p.goto('http://localhost:3000/login');
  await p.fill('#email', 'demo@brandrocket.com');
  await p.fill('#password', 'demo1234');
  await p.click('button[type="submit"]');
  
  console.log('Waiting for redirect...');
  await p.waitForURL('**/dashboard**', { timeout: 15000 });
  console.log('Logged in! URL:', p.url());
  
  await p.goto('http://localhost:3000/dashboard/social');
  await p.waitForTimeout(3000);
  console.log('Social URL:', p.url());
  
  const has404 = await p.evaluate(() => document.body.innerText.includes('404'));
  console.log('Has 404:', has404);
  
  await p.screenshot({ path: 'scratch/social-local-logged-in.png' });
  await b.close();
})();
