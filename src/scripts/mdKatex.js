import katex from 'katex'
import 'katex/dist/katex.css'

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
    name: 'inlineKatex',
    level: 'inline',
    start(src) {
      return src.indexOf('$')
    },
    tokenizer(src, _tokens) {
      const match = src.match(/^\$+([^$\n]+?)\$+/)
      if (match) {
        return {
          type: 'inlineKatex',
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
    name: 'blockKatex',
    level: 'block',
    start(src) {
      return src.indexOf('$$')
    },
    tokenizer(src, _tokens) {
      const match = src.match(/^\$\$+\n([^$]+?)\n\$\$/)
      if (match) {
        return {
          type: 'blockKatex',
          raw: match[0],
          text: match[1].trim()
        }
      }
    },
    renderer(token) {
      options.displayMode = true
      return `<p>${katex.renderToString(token.text, options)}</p>`
    }
  }
}