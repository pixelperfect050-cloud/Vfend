const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  
  // Test Email Login & Logout
  console.log('Testing Email Login...');
  await p.goto('http://localhost:3000/login');
  await p.fill('#email', 'demo@brandrocket.com');
  await p.fill('#password', 'demo1234');
  await p.click('button[type="submit"]');
  
  await p.waitForURL('**/dashboard**', { timeout: 15000 });
  console.log('Logged in successfully!');
  
  // Click Avatar dropdown
  await p.click('button.rounded-full'); // Assuming the avatar button has these classes
  await p.waitForTimeout(1000);
  
  // Click Logout
  await p.click('text=Log out');
  
  await p.waitForURL('**/login**', { timeout: 15000 }).catch(() => {});
  // Or it redirects to '/' according to requirements
  await p.waitForURL('http://localhost:3000/', { timeout: 5000 }).catch(() => {});
  
  console.log('Logged out! URL:', p.url());
  
  if (p.url() === 'http://localhost:3000/' || p.url() === 'http://localhost:3000/login') {
      console.log('Email Logout Test Passed!');
  } else {
      console.log('Email Logout Test Failed!');
  }
  
  await b.close();
})();
