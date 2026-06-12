let initialTheme = null

function isThemeToken(key, value) {
  return (
    typeof key === 'string' &&
    key.startsWith('--') &&
    (typeof value === 'string' || typeof value === 'number')
  )
}

function hasThemeTokens(theme) {
  return (
    theme &&
    typeof theme === 'object' &&
    Object.entries(theme).some(([key, value]) => isThemeToken(key, value))
  )
}

function getThemeList(themes) {
  return Array.isArray(themes) ? themes.filter(hasThemeTokens) : []
}

function getRandomIndex(length) {
  return Math.floor(Math.random() * length)
}

export function applyTheme(theme, root) {
  const target = root ?? (typeof document === 'undefined' ? null : document.documentElement)
  if (!hasThemeTokens(theme) || !target?.style) return false

  for (const [key, value] of Object.entries(theme)) {
    if (isThemeToken(key, value)) {
      target.style.setProperty(key, String(value))
    }
  }

  return true
}

export function pickRandomTheme(themes) {
  const themeList = getThemeList(themes)
  if (themeList.length === 0) return null

  return themeList[getRandomIndex(themeList.length)]
}

export function applyInitialTheme(themes) {
  if (initialTheme) return initialTheme

  initialTheme = pickRandomTheme(themes)

  if (initialTheme && typeof document !== 'undefined') {
    applyTheme(initialTheme)
  }

  return initialTheme
}
