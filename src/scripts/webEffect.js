export function applyRandomTheme(config) {
  const themes = config.colors
  if (!themes || themes.length === 0) return
  const theme = themes[Math.floor(Math.random() * themes.length)]

  for (const key in theme) {
    if (key.startsWith('--')) {
      document.documentElement.style.setProperty(key, theme[key])
      // document.querySelector('html').style.setProperty(key, theme[key])
    }
  }
}

export function applyGlobalStyle(config) {
  const body = document.body;
  const root = document.documentElement;
  const footer = document.querySelector('.footer-bar');

  // 小工具函数：根据布尔值切换类
  const toggleClass = (el, className, condition) => {
    if (!el) return;
    el.classList.toggle(className, condition);
  };

  // 动态 footer
  toggleClass(footer, "dynamic-footer", config.isDynamicFooter);
  toggleClass(footer, "pattern-bg", config.isDynamicFooter && config.isPatternBackground);

  // 背景
  toggleClass(root, "fixed-page", config.isPatternBackground);
  toggleClass(body, "pattern-bg", config.isPatternBackground);
}