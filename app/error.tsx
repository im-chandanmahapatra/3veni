'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

/** Route-level error boundary: honest message, retry, and a way out (plan B16). No stack traces. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="page-top not-found" role="alert">
      <div className="wrap wrap--narrow">
        <p className="t-overline">Something went wrong</p>
        <h1 className="t-display-lg">We could not load this page.</h1>
        <p className="t-lead">This is a problem on our side, not yours. Try again, or return to the home page.</p>
        {error.digest ? <p className="t-caption">Reference {error.digest}</p> : null}
        <div className="not-found__actions">
          <Button onClick={reset} icon={null}>
            Try again
          </Button>
          <Button href="/" variant="secondary" icon={null}>
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
