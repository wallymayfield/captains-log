import { useMemo } from "react";
import type { Doc } from "@/lib/document";
import { renderMarkdown } from "@/lib/markdown";

type PreviewProps = { doc: Doc };

export function Preview({ doc }: PreviewProps) {
  const html = useMemo(() => renderMarkdown(doc.body), [doc.body]);
  const title = doc.title.trim() || "Untitled log entry";

  return (
    <article className="lcars-preview">
      <header className="lcars-preview__header">
        <h1 className="lcars-preview__title">{title}</h1>
        <p className="lcars-preview__meta">
          <time dateTime={doc.date}>{formatPreviewDate(doc.date)}</time>
        </p>
        {doc.excerpt.trim() ? (
          <p className="lcars-preview__excerpt">{doc.excerpt}</p>
        ) : null}
      </header>
      <div
        className="lcars-preview__body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

function formatPreviewDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
