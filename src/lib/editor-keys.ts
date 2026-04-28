// Keyboard handlers for the body textarea. Uses
// document.execCommand("insertText") so React's onChange fires
// naturally and native undo history is preserved. The function is
// deprecated but still universally supported in browsers.

function getSelection(el: HTMLTextAreaElement): { start: number; end: number } {
  return { start: el.selectionStart, end: el.selectionEnd };
}

function insertText(el: HTMLTextAreaElement, text: string): void {
  el.focus();
  document.execCommand("insertText", false, text);
}

function wrap(
  el: HTMLTextAreaElement,
  open: string,
  close: string,
  placeholder = "",
): void {
  const { start, end } = getSelection(el);
  const selected = el.value.slice(start, end) || placeholder;
  insertText(el, open + selected + close);
  // execCommand leaves the caret at the end of the inserted text;
  // move it back so the selection covers the wrapped content.
  el.selectionStart = start + open.length;
  el.selectionEnd = start + open.length + selected.length;
}

function toggleHeading(el: HTMLTextAreaElement, level: number): void {
  const v = el.value;
  const { start } = getSelection(el);
  const lineStart = v.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = v.indexOf("\n", start);
  const lineEnd = lineEndIdx === -1 ? v.length : lineEndIdx;
  const line = v.slice(lineStart, lineEnd);
  const stripped = line.replace(/^#+\s*/, "");
  const prefix = "#".repeat(level) + " ";
  const newLine = line.startsWith(prefix) ? stripped : prefix + stripped;

  el.setSelectionRange(lineStart, lineEnd);
  insertText(el, newLine);
  // Place caret at end of the replaced line.
  const cursor = lineStart + newLine.length;
  el.selectionStart = cursor;
  el.selectionEnd = cursor;
}

function indentSelection(el: HTMLTextAreaElement, outdent = false): void {
  const v = el.value;
  const { start, end } = getSelection(el);
  const lineStart = v.lastIndexOf("\n", start - 1) + 1;

  // Multi-line selection: indent / outdent each line in the range.
  if (start !== end && v.slice(start, end).includes("\n")) {
    const block = v.slice(lineStart, end);
    const transformed = block
      .split("\n")
      .map((l) => (outdent ? l.replace(/^( {2}|\t)/, "") : "  " + l))
      .join("\n");
    el.setSelectionRange(lineStart, end);
    insertText(el, transformed);
    el.selectionStart = lineStart;
    el.selectionEnd = lineStart + transformed.length;
    return;
  }

  if (outdent) {
    const line = v.slice(lineStart);
    if (line.startsWith("  ")) {
      el.setSelectionRange(lineStart, lineStart + 2);
      insertText(el, "");
    }
    return;
  }
  insertText(el, "  ");
}

function continueList(el: HTMLTextAreaElement): boolean {
  const v = el.value;
  const { start, end } = getSelection(el);
  if (start !== end) return false;
  const lineStart = v.lastIndexOf("\n", start - 1) + 1;
  const line = v.slice(lineStart, start);

  // Task list — must come before bullet (more specific match).
  const task = line.match(/^(\s*)([-*+])\s+\[[ xX]\]\s+(.*)$/);
  if (task) {
    const [, indent, marker, content] = task;
    if (content === "") {
      el.setSelectionRange(lineStart, start);
      insertText(el, "");
      return true;
    }
    insertText(el, `\n${indent ?? ""}${marker ?? "-"} [ ] `);
    return true;
  }

  // Bullet list (-, *, +)
  const bullet = line.match(/^(\s*)([-*+])\s+(.*)$/);
  if (bullet) {
    const [, indent, marker, content] = bullet;
    if (content === "") {
      el.setSelectionRange(lineStart, start);
      insertText(el, "");
      return true;
    }
    insertText(el, `\n${indent ?? ""}${marker ?? "-"} `);
    return true;
  }

  // Numbered list
  const numbered = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
  if (numbered) {
    const [, indent, num, content] = numbered;
    if (content === "") {
      el.setSelectionRange(lineStart, start);
      insertText(el, "");
      return true;
    }
    const nextNum = (Number(num ?? "1") || 1) + 1;
    insertText(el, `\n${indent ?? ""}${nextNum}. `);
    return true;
  }

  return false;
}

export function handleEditorKeyDown(
  e: KeyboardEvent,
  el: HTMLTextAreaElement,
): void {
  const mod = e.metaKey || e.ctrlKey;

  if (e.key === "Tab") {
    e.preventDefault();
    indentSelection(el, e.shiftKey);
    return;
  }

  if (e.key === "Enter" && !e.shiftKey && !mod) {
    if (continueList(el)) {
      e.preventDefault();
      return;
    }
  }

  if (!mod) return;

  const key = e.key.toLowerCase();
  if (key === "b" && !e.shiftKey) {
    e.preventDefault();
    wrap(el, "**", "**", "bold");
  } else if (key === "i" && !e.shiftKey) {
    e.preventDefault();
    wrap(el, "*", "*", "italic");
  } else if (key === "k" && !e.shiftKey) {
    e.preventDefault();
    const { start, end } = getSelection(el);
    const selected = el.value.slice(start, end) || "link text";
    insertText(el, `[${selected}](url)`);
    const urlStart = start + selected.length + 3;
    el.selectionStart = urlStart;
    el.selectionEnd = urlStart + 3;
  } else if (e.shiftKey && (key === "1" || key === "2" || key === "3")) {
    e.preventDefault();
    toggleHeading(el, Number(key));
  }
}

const URL_RE = /^(?:https?:\/\/|mailto:)\S+$/i;

// Smart paste — when a URL is pasted over a non-empty selection,
// wrap the selection as a markdown link.
export function handleEditorPaste(
  e: ClipboardEvent,
  el: HTMLTextAreaElement,
): void {
  const data = e.clipboardData?.getData("text/plain") ?? "";
  if (!URL_RE.test(data.trim())) return;
  const { start, end } = getSelection(el);
  if (start === end) return;
  e.preventDefault();
  const selected = el.value.slice(start, end);
  insertText(el, `[${selected}](${data.trim()})`);
}
