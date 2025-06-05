export function applyRandomTheme(config) {
  const themes = config.colors
  if (!themes || themes.length === 0) return
  const theme = themes[Math.floor(Math.random() * themes.length)]

  for (const key in theme) {
    if (key.startsWith('--')) {
      document.documentElement.style.setProperty(key, theme[key])
    //   document.querySelector('html').style.setProperty(key, theme[key])
    }
  }
}