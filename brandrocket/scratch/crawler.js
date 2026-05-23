const { chromium, devices } = require('playwright');
const fs = require('fs');

const url = 'https://brandrocket-ebon.vercel.app';
const results = {
  pagesTested: new Set(),
  clicksPerformed: 0,
  brokenRoutes: [],
  consoleErrors: [],
  networkErrors: [],
  mobileIssues: [],
  authIssues: [],
};

const viewports = [
  { name: 'Desktop', width: 1920, height: 1080, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { name: 'Tablet', width: 768, height: 1024, userAgent: 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1' },
  { name: 'iPhone 12', ...devices['iPhone 12'] }
];

async function runAudit() {
  for (const vp of viewports) {
    console.log(`\n--- Starting audit for ${vp.name} ---`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: vp.width ? { width: vp.width, height: vp.height } : vp.viewport,
      userAgent: vp.userAgent,
    });

    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        const text = msg.text();
        if (text.includes('Hydration') || text.includes('Warning')) {
            results.consoleErrors.push(`[${vp.name}] React Warning: ${text}`);
        } else {
            results.consoleErrors.push(`[${vp.name}] Console ${msg.type()}: ${text}`);
        }
      }
    });

    page.on('pageerror', error => {
      results.consoleErrors.push(`[${vp.name}] Uncaught Exception: ${error.message}`);
    });

    page.on('response', response => {
      if (response.status() >= 400 && response.status() !== 401 && response.status() !== 403) {
        results.networkErrors.push(`[${vp.name}] ${response.status()} ${response.url()}`);
      }
    });

    const routesToTest = [
      '/',
      '/login',
      '/signup',
      '/dashboard',
      '/onboarding',
      '/dashboard/settings',
      '/dashboard/billing',
      '/dashboard/campaigns/new',
      '/dashboard/demo',
      '/dashboard/ai'
    ];

    for (const route of routesToTest) {
      try {
        const fullUrl = `${url}${route}`;
        const response = await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
        results.pagesTested.add(fullUrl);
        
        if (response && response.status() >= 400 && response.status() !== 401 && response.status() !== 403) {
           results.brokenRoutes.push(`[${vp.name}] ${route} returned ${response.status()}`);
        }

        // Check for redirect loops / auth issues
        if (route.startsWith('/dashboard') && !page.url().includes('/dashboard')) {
           if (!results.authIssues.some(i => i.includes('redirected out of dashboard'))) {
             results.authIssues.push(`[${vp.name}] Unauthenticated user redirected out of dashboard from ${route}`);
           }
        }

        // Check for overflow / mobile issues
        if (vp.name.includes('iPhone')) {
           const overflowX = await page.evaluate(() => {
             return document.documentElement.scrollWidth > window.innerWidth;
           });
           if (overflowX) {
             results.mobileIssues.push(`[${vp.name}] Horizontal overflow detected on ${route}`);
           }
        }

        // Collect buttons & links to click
        const clickableSelectors = ['button', 'a[href]', '[role="button"]', '[role="menuitem"]'];
        for (const selector of clickableSelectors) {
          const elements = await page.$$(selector);
          for (let i = 0; i < Math.min(elements.length, 5); i++) {
            try {
              if (await elements[i].isVisible()) {
                const textContent = await elements[i].textContent();
                const isAuthButton = textContent && (
                  textContent.toLowerCase().includes('google') ||
                  textContent.toLowerCase().includes('sign up') ||
                  textContent.toLowerCase().includes('log in') ||
                  textContent.toLowerCase().includes('sign in')
                );

                if (!isAuthButton) {
                  await elements[i].click({ timeout: 1000, noWaitAfter: true });
                  results.clicksPerformed++;
                  await page.waitForTimeout(200);
                }
              }
            } catch (e) {}
          }
        }
        
      } catch (error) {
        console.error(`[${vp.name}] Error navigating to ${route}: ${error.message}`);
        results.brokenRoutes.push(`[${vp.name}] Failed to load ${route}: ${error.message}`);
      }
    }
    
    // Auth Test
    try {
       await page.goto(`${url}/signup`, { waitUntil: 'networkidle' });
       // Check if fields exist
       const emailInput = await page.$('input[type="email"]');
       const passInput = await page.$('input[type="password"]');
       if (!emailInput || !passInput) {
          results.authIssues.push(`[${vp.name}] Missing email or password inputs on /signup`);
       }
       
       await page.goto(`${url}/login`, { waitUntil: 'networkidle' });
       const emailInputL = await page.$('input[type="email"]');
       const passInputL = await page.$('input[type="password"]');
       if (!emailInputL || !passInputL) {
          results.authIssues.push(`[${vp.name}] Missing email or password inputs on /login`);
       }
       
       // Try logging in with dummy
       if (emailInputL && passInputL) {
          await emailInputL.fill(`qa_test_${Date.now()}@example.com`);
          await passInputL.fill(`TestPassword123!`);
          const loginBtn = await page.$('button[type="submit"]');
          if (loginBtn) {
             await loginBtn.click();
             results.clicksPerformed++;
             await page.waitForTimeout(2000);
             if (page.url().includes('/login')) {
                 results.authIssues.push(`[${vp.name}] Login failed or rejected (expected if no backend)`);
             }
          }
       }
    } catch (e) {}

    await browser.close();
  }

  // Deduplicate results
  results.consoleErrors = [...new Set(results.consoleErrors)];
  results.networkErrors = [...new Set(results.networkErrors)];
  results.brokenRoutes = [...new Set(results.brokenRoutes)];
  results.mobileIssues = [...new Set(results.mobileIssues)];
  results.authIssues = [...new Set(results.authIssues)];

  fs.writeFileSync('audit_results.json', JSON.stringify({
    ...results,
    pagesTested: Array.from(results.pagesTested)
  }, null, 2));

  console.log('Audit complete. Results saved to audit_results.json');
}

runAudit();
