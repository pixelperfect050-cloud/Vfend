import { test, expect } from '@playwright/test';

// Array to capture global errors
const pageErrors: any[] = [];
const consoleErrors: any[] = [];
const failedRequests: any[] = [];

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.status() !== 401 && response.status() !== 403) {
      // Ignore auth checks returning 401/403 as expected behavior
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });
});

test.describe('Phase 1: Homepage Audit', () => {
  test('Verify Homepage loads and key buttons exist', async ({ page }) => {
    await page.goto('/');
    
    // Check Hero
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check Navbar Links — actual text is "Sign In" not "Login"
    const signInLink = page.getByRole('link', { name: /sign in/i }).first();
    // CTA buttons: "Launch Your First Campaign" and "Explore Demo Workspace"
    const ctaBtn = page.getByRole('link', { name: /launch your first campaign/i }).first();
    
    await expect(signInLink).toBeVisible();
    await expect(ctaBtn).toBeVisible();
  });
});

test.describe('Phase 2: Authentication UI', () => {
  test('Email Signup Flow UI', async ({ page }) => {
    await page.goto('/signup');
    // Placeholders are "name@example.com" and "••••••••", use labels instead
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    
    // Test validation
    await page.getByRole('button', { name: /sign up/i }).click();
    // Wait briefly for validation messages to appear
    await page.waitForTimeout(500);
  });

  test('Login Flow UI', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    const googleBtn = page.getByRole('button', { name: /google/i });
    await expect(googleBtn).toBeVisible();
  });
  
  test('Protected Routes Redirect to Login', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect back to login since we are not authenticated
    await expect(page).toHaveURL(/.*login.*/);
    
    // Settings lives at /dashboard/settings, not /settings
    await page.goto('/dashboard/settings');
    await expect(page).toHaveURL(/.*login.*/);
  });
});

test.describe('Phase 8: Error Collection', () => {
  test('Report Collected Errors', async () => {
    console.log('--- QA AUDIT ERROR REPORT ---');
    console.log(`Page Errors: ${pageErrors.length}`, pageErrors);
    console.log(`Console Errors: ${consoleErrors.length}`, consoleErrors);
    console.log(`Failed Requests: ${failedRequests.length}`, failedRequests);
    
    // We expect 0 runtime page errors (React crashes)
    expect(pageErrors.length).toBe(0);
  });
});
