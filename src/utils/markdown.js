let markedWithKatexPromise = null

export function getMarkedWithKatex() {
  if (!markedWithKatexPromise) {
    markedWithKatexPromise = Promise.all([import('marked'), import('@/utils/mdKatex.js')])
      .then(([{ marked }, { default: katexExt }]) => {
        marked.use(katexExt())
        return marked
      })
      .catch((error) => {
        markedWithKatexPromise = null
        throw error
      })
  }

  return markedWithKatexPromise
}
