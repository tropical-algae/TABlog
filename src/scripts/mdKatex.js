import katex from "katex"
import "katex/dist/katex.css"

export default function (options = {}) {
  return {
    extensions: [
      inlineKatex(options),
      blockKatex(options)
    ]
  }
}
function inlineKatex(options) {
  return {
    name: "inlineKatex",
    level: "inline",
    start(src) {
      return src.indexOf("$")
    },
    tokenizer(src) {
      const match = src.match(/^\$([^$\n]+?)\$/)
      if (match) {
        return {
          type: "inlineKatex",
          raw: match[0],
          text: match[1].trim()
        }
      }
    },
    renderer(token) {
      return katex.renderToString(token.text, options)
    }
  }
}

function blockKatex(options) {
  return {
    name: "blockKatex",
    level: "block",
    start(src) {
      return src.indexOf("$$")
    },
    tokenizer(src) {
      // 仅匹配段落级公式，要求独占一行
      const match = src.match(/^\$\$\s*\n([\s\S]+?)\n\$\$/)
      if (match) {
        return {
          type: "blockKatex",
          raw: match[0],
          text: match[1].trim()
        }
      }
    },
    renderer(token) {
      return `<p>${katex.renderToString(token.text, { ...options, displayMode: true })}</p>`
    }
  }
}