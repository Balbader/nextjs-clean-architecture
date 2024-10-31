'use client';

/**
 * Global Error Handler Component - Clean Architecture Interface Adapter
 * 
 * This component acts as an interface adapter in the clean architecture pattern,
 * handling the presentation of global errors across the application. It serves as
 * a boundary between the framework (Next.js) and our application's error handling
 * infrastructure.
 * 
 * Key responsibilities:
 * - Captures unhandled errors and reports them to Sentry for monitoring
 * - Provides a consistent error UI across the application
 * - Acts as a last line of defense for error handling in the Next.js App Router
 */

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
