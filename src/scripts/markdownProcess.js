export function removeMetadataFromMarkdown(md, matchPrefixes = []) {
  const lines = md.split('\n')
  let hasMatchingItem = false
  let cutIndex = -1

  // 构造正则（支持多个前缀）
  const prefixRegex = new RegExp(`^[-*+]\\s+(${matchPrefixes.join('|')}):`, 'i')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // 检查是否为分隔线
    if (/^---+$/.test(line)) {
      cutIndex = i
      break
    }

    // 是否匹配目标前缀列表项
    if (prefixRegex.test(line)) {
      hasMatchingItem = true
    }
  }

  // 满足：出现分隔线 且 前面出现过匹配项
  if (cutIndex >= 0 && hasMatchingItem) {
    return lines.slice(cutIndex + 1).join('\n').trim()
  }

  // 不处理
  return md
}

export function fixLocalAssetPaths(mdContent, dirPath) {
  return mdContent.replace(/(!\[.*?\]\()(\.\/|\.\.\/|[^\/].*?)(\))/g, (match, prefix, relativePath, suffix) => {
    // 忽略外链
    if (/^(https?:)?\/\//.test(relativePath)) return match

    const normalized = relativePath.replace(/^\.?\//, '') // 移除 ./ 或 / 前缀
    const fixedPath = `${dirPath}/${normalized}`.replace(/\/+/g, '/')

    return `${prefix}${fixedPath}${suffix}`
  })
}

export function extractMetadataFromMarkdown(mdText, labelMap) {
  const lines = mdText.split('\n')
  const result = {}

  let cutIndex = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (/^---+$/.test(line)) {
      cutIndex = i
      break
    }

    // 判断是否是列表项且包含 key
    const match = /^[-*+]\s*(.+?):\s*(.+)$/.exec(line)
    if (match) {
      const label = match[1].trim().toLowerCase()
      const value = match[2].trim()

      // 检查是否是我们要提取的 label
      const mappedKey = labelMap[label]
      if (mappedKey) {
        if (mappedKey === 'labels') {
          if (!result.labels) result.labels = []
          result.labels.push(value)
        } else if (mappedKey === 'create_time' && !result.create_time) {
          result.create_time = value
        } else {
          result[mappedKey] = value
        }
      }
    }
  }

  // 默认值处理
  if (!result.create_time) result.create_time = ''
  if (!result.labels) result.labels = []

  return result
}