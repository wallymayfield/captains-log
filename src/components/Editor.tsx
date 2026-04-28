import { useEffect, useRef, useState } from "react";
import type { Doc } from "@/lib/document";
import { DatePicker } from "./DatePicker";
import {
  handleEditorKeyDown,
  handleEditorPaste,
} from "@/lib/editor-keys";

type EditorProps = {
  doc: Doc;
  onChange: (next: Doc) => void;
};

export function Editor({ doc, onChange }: EditorProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => handleEditorKeyDown(e, el);
    const onPaste = (e: ClipboardEvent) => handleEditorPaste(e, el);
    el.addEventListener("keydown", onKey);
    el.addEventListener("paste", onPaste);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("paste", onPaste);
    };
  }, []);

  return (
    <div className="lcars-editor">
      <input
        type="text"
        className="lcars-editor__title"
        value={doc.title}
        onChange={(e) => onChange({ ...doc, title: e.target.value })}
        placeholder="Mission designation pending"
        spellCheck
        aria-label="Title"
      />

      <div className="lcars-editor__meta">
        <div className="lcars-editor__field">
          <span className="lcars-editor__field-label">Date</span>
          <button
            type="button"
            className="lcars-editor__date"
            onClick={() => setDatePickerOpen(true)}
          >
            {doc.date}
          </button>
        </div>

        <label className="lcars-editor__field lcars-editor__field--grow">
          <span className="lcars-editor__field-label">Excerpt</span>
          <textarea
            className="lcars-editor__excerpt"
            value={doc.excerpt}
            onChange={(e) => onChange({ ...doc, excerpt: e.target.value })}
            placeholder="Brief for subspace dispatch"
            rows={2}
            spellCheck
          />
        </label>
      </div>

      <textarea
        ref={bodyRef}
        className="lcars-editor__body"
        value={doc.body}
        onChange={(e) => onChange({ ...doc, body: e.target.value })}
        placeholder="Captain's log, supplemental…"
        spellCheck
        aria-label="Body"
      />

      <DatePicker
        open={datePickerOpen}
        value={doc.date}
        onChange={(d) => onChange({ ...doc, date: d })}
        onClose={() => setDatePickerOpen(false)}
      />
    </div>
  );
}
