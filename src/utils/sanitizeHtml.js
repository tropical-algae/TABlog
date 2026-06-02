import DOMPurify from "dompurify"

export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html)
}
