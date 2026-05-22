import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Navigate to login page
    console.log('📄 Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 15000 });
    
    const title = await page.title();
    console.log(`✅ Page loaded. Title: "${title}"`);

    // 2. Check if form elements exist
    const emailInput = await page.$('#email');
    const passwordInput = await page.$('#password');
    
    if (!emailInput || !passwordInput) {
      console.log('❌ Form inputs not found in DOM!');
      await browser.close();
      process.exit(1);
    }
    console.log('✅ Email and Password inputs found in DOM');

    // 3. Type dummy credentials
    console.log('⌨️  Typing test credentials...');
    await page.type('#email', 'test@example.com', { delay: 50 });
    await page.type('#password', 'password123', { delay: 50 });
    console.log('✅ Credentials entered: test@example.com / password123');

    // 4. Click Sign In button
    console.log('🖱️  Clicking Sign In button...');
    const signInButton = await page.$('button[type="submit"]');
    if (!signInButton) {
      console.log('❌ Sign In button not found!');
      await browser.close();
      process.exit(1);
    }
    await signInButton.click();
    console.log('✅ Sign In button clicked');

    // 5. Wait for response (toast notification or redirect)
    console.log('⏳ Waiting for response...');
    await page.waitForFunction(() => {
      // Check for toast messages (sonner)
      const toasts = document.querySelectorAll('[data-sonner-toast]');
      // Check for URL change (redirect to dashboard)
      const redirected = window.location.pathname !== '/login';
      return toasts.length > 0 || redirected;
    }, { timeout: 10000 }).catch(() => {
      console.log('⚠️  No toast or redirect detected within 10s');
    });

    // 6. Check results
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Check for toast messages
    const toastMessages = await page.evaluate(() => {
      const toasts = document.querySelectorAll('[data-sonner-toast]');
      return Array.from(toasts).map(t => t.textContent);
    });

    if (toastMessages.length > 0) {
      console.log('🔔 Toast messages:');
      toastMessages.forEach(msg => console.log(`   → ${msg}`));
    }

    // Check for validation errors on page
    const validationErrors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('.text-destructive');
      return Array.from(errorElements).map(el => el.textContent);
    });

    if (validationErrors.length > 0) {
      console.log('⚠️  Validation errors:');
      validationErrors.forEach(err => console.log(`   → ${err}`));
    }

    if (currentUrl.includes('/dashboard')) {
      console.log('🎉 SUCCESS: Redirected to dashboard!');
    } else {
      console.log('ℹ️  Login attempt completed (expected: invalid credentials error for dummy data)');
    }

    // Take a screenshot
    await page.screenshot({ path: 'login-test-result.png', fullPage: true });
    console.log('📸 Screenshot saved: login-test-result.png');

  } catch (err) {
    console.error('❌ Error:', err.message);
    await page.screenshot({ path: 'login-test-error.png', fullPage: true });
    console.log('📸 Error screenshot saved: login-test-error.png');
  } finally {
    await browser.close();
    console.log('🏁 Browser closed. Test complete.');
  }
})();
