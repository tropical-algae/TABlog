import DOMPurify from "dompurify"

DOMPurify.addHook("afterSanitizeAttributes", node => {
  if (node.tagName === "A") {
    const href = node.getAttribute("href")

    if (!href) return

    node.setAttribute("target", "_blank")
    node.setAttribute("rel", "noopener noreferrer")
  }
})

export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["target"]
  })
}
