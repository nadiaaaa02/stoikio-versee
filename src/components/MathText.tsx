import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Renders a string that may contain LaTeX delimiters:
 *  - \( ... \)  → inline math
 *  - $$ ... $$  → display math (block)
 *  - $ ... $    → inline math
 *
 * Everything else is rendered as plain HTML text.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const html = renderMathInString(text);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Block-level display math. Renders a single LaTeX expression as a centered block.
 * No delimiters needed — the entire `tex` prop is treated as LaTeX.
 */
export function MathBlock({ tex, className }: { tex: string; className?: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false, trust: true });
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Inline math. Renders a single LaTeX expression inline.
 * No delimiters needed.
 */
export function InlineMath({ tex, className }: { tex: string; className?: string }) {
  const html = katex.renderToString(tex, { displayMode: false, throwOnError: false, trust: true });
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// --- internal parser ---

function renderMathInString(input: string): string {
  // Order matters: parse $$ before $, and \( \) before $
  let result = "";
  let i = 0;
  const s = input;

  while (i < s.length) {
    // Check for \( ... \)
    if (s[i] === "\\" && s[i + 1] === "(") {
      const end = s.indexOf("\\)", i + 2);
      if (end !== -1) {
        const tex = s.slice(i + 2, end);
        result += katex.renderToString(tex, { displayMode: false, throwOnError: false, trust: true });
        i = end + 2;
        continue;
      }
    }
    // Check for \[ ... \]
    if (s[i] === "\\" && s[i + 1] === "[") {
      const end = s.indexOf("\\]", i + 2);
      if (end !== -1) {
        const tex = s.slice(i + 2, end);
        result += katex.renderToString(tex, { displayMode: true, throwOnError: false, trust: true });
        i = end + 2;
        continue;
      }
    }
    // Check for $$ ... $$
    if (s[i] === "$" && s[i + 1] === "$") {
      const end = s.indexOf("$$", i + 2);
      if (end !== -1) {
        const tex = s.slice(i + 2, end);
        result += katex.renderToString(tex, { displayMode: true, throwOnError: false, trust: true });
        i = end + 2;
        continue;
      }
    }
    // Check for $ ... $ (single)
    if (s[i] === "$" && s[i + 1] !== "$") {
      const end = s.indexOf("$", i + 1);
      if (end !== -1 && end > i + 1) {
        const tex = s.slice(i + 1, end);
        result += katex.renderToString(tex, { displayMode: false, throwOnError: false, trust: true });
        i = end + 1;
        continue;
      }
    }
    // Escape HTML for regular text
    if (s[i] === "<") result += "&lt;";
    else if (s[i] === ">") result += "&gt;";
    else if (s[i] === "&") result += "&amp;";
    else result += s[i];
    i++;
  }
  return result;
}
