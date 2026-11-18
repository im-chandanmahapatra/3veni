/**
 * Renders JSON-LD. Per the Next.js JSON-LD guide, "<" is escaped so a string can never close the script tag
 * (V1 used a bare JSON.stringify).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
