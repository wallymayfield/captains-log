import DOMPurify from "dompurify";
import { marked } from "marked";

marked.use({ gfm: true, breaks: false });

export function renderMarkdown(src: string): string {
  const raw = marked.parse(src) as string;
  return DOMPurify.sanitize(raw);
}
