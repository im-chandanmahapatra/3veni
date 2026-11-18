'use client';

/** Last-resort boundary (root layout failed): self-contained markup, no dependencies on the site chrome or CSS. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: 'Georgia, serif', background: '#F7F3EC', color: '#1B1A17' }}>
        <main style={{ maxWidth: '36rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <h1 style={{ fontWeight: 400, fontSize: '2rem', lineHeight: 1.2 }}>3VENI SPHERE is temporarily unavailable.</h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>Something went wrong on our side. Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{ minHeight: '2.75rem', padding: '0 1.5rem', border: '1px solid #1B1A17', background: '#1B1A17', color: '#F7F3EC', font: '600 1rem system-ui, sans-serif', cursor: 'pointer' }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
