import type { Doc } from "@/lib/document";

type EditorProps = {
  doc: Doc;
  onChange: (next: Doc) => void;
};

export function Editor({ doc, onChange }: EditorProps) {
  return (
    <div className="lcars-editor">
      <input
        type="text"
        className="lcars-editor__title"
        value={doc.title}
        onChange={(e) => onChange({ ...doc, title: e.target.value })}
        placeholder="Untitled log entry"
        spellCheck
        aria-label="Title"
      />

      <div className="lcars-editor__meta">
        <label className="lcars-editor__field">
          <span className="lcars-editor__field-label">Date</span>
          <input
            type="date"
            className="lcars-editor__date"
            value={doc.date}
            onChange={(e) => onChange({ ...doc, date: e.target.value })}
          />
        </label>

        <label className="lcars-editor__field lcars-editor__field--grow">
          <span className="lcars-editor__field-label">Excerpt</span>
          <textarea
            className="lcars-editor__excerpt"
            value={doc.excerpt}
            onChange={(e) => onChange({ ...doc, excerpt: e.target.value })}
            placeholder="Short blurb shown in feeds"
            rows={2}
            spellCheck
          />
        </label>
      </div>

      <textarea
        className="lcars-editor__body"
        value={doc.body}
        onChange={(e) => onChange({ ...doc, body: e.target.value })}
        placeholder="Begin entry…"
        spellCheck
        aria-label="Body"
      />
    </div>
  );
}
