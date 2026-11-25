// Inline tokens only: {{redact:N}} -> bar, `code` -> <code>, **bold**, [text](url). Everything else is escaped.
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
export function fmt(input: string): string {
  return esc(input)
    .replace(/\{\{redact:(\d+)\}\}/g, '<span class="w-redact" role="img" aria-label="redacted" style="width:$1ch"></span>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
export function fmtTid(input: string): string {
  return esc(input).replace(/\b(T\d{4}(?:\.\d{3})?|4625|60204)\b/g, '<span class="tid">$1</span>');
}
