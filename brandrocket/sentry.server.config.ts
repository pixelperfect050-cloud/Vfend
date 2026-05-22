import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isSentryEnabled = dsn && dsn !== 'REPLACE_BEFORE_PRODUCTION';

Sentry.init({
  dsn: isSentryEnabled ? dsn : undefined,
  enabled: !!isSentryEnabled,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
