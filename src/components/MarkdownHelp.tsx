import { Modal } from "./Modal";
import { Pill } from "./primitives";

type Row = { syntax: string; result: string };

const FORMAT_ROWS: Row[] = [
  { syntax: "**bold**", result: "Bold text" },
  { syntax: "*italic*", result: "Italic text" },
  { syntax: "~~strike~~", result: "Strikethrough" },
  { syntax: "`code`", result: "Inline code" },
  { syntax: "==mark== / <mark>mark</mark>", result: "Highlighted" },
];

const STRUCTURE_ROWS: Row[] = [
  { syntax: "# H1   ## H2   ### H3", result: "Headings (1–6)" },
  { syntax: "- item", result: "Bulleted list" },
  { syntax: "1. item", result: "Numbered list" },
  { syntax: "- [ ] todo", result: "Task list" },
  { syntax: "> quote", result: "Block quote" },
  { syntax: "---", result: "Horizontal rule" },
];

const RICH_ROWS: Row[] = [
  { syntax: "[label](https://…)", result: "Link" },
  { syntax: "![alt](image.png)", result: "Image" },
  { syntax: "```js\\ncode\\n```", result: "Fenced code block (with language)" },
  { syntax: "| h1 | h2 |\\n|----|----|\\n| a | b |", result: "Table (GFM pipes)" },
  { syntax: "Footnote ref[^1]\\n[^1]: definition", result: "Footnote" },
];

const SHORTCUT_ROWS: Row[] = [
  { syntax: "Cmd / Ctrl + B", result: "Wrap selection in **bold**" },
  { syntax: "Cmd / Ctrl + I", result: "Wrap selection in *italic*" },
  { syntax: "Cmd / Ctrl + K", result: "Wrap selection as a [link](url)" },
  { syntax: "Cmd / Ctrl + Shift + 1 / 2 / 3", result: "Toggle line as # / ## / ### heading" },
  { syntax: "Tab / Shift + Tab", result: "Indent / outdent (2 spaces)" },
  { syntax: "Enter on a list item", result: "Continue the list (or exit if empty)" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MarkdownHelp({ open, onClose }: Props) {
  return (
    <Modal open={open} title="Markdown Reference" refId="42-1138" onClose={onClose}>
      <Section title="Inline" rows={FORMAT_ROWS} />
      <Section title="Structure" rows={STRUCTURE_ROWS} />
      <Section title="Rich" rows={RICH_ROWS} />
      <Section title="Editor shortcuts" rows={SHORTCUT_ROWS} />
      <footer className="lcars-modal__footer">
        <Pill label="DISMISS" color="orange" onClick={onClose} />
      </footer>
    </Modal>
  );
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="lcars-help__section">
      <h3 className="lcars-help__section-title">{title}</h3>
      <dl className="lcars-help__rows">
        {rows.map((r) => (
          <div className="lcars-help__row" key={r.syntax}>
            <dt className="lcars-help__syntax">{r.syntax}</dt>
            <dd className="lcars-help__result">{r.result}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
