export function removeMetadataFromMarkdown(md, matchPrefixes = []) {
  const lines = md.split('\n')
  let hasMatchingItem = false
  let cutIndex = -1

  const prefixRegex = new RegExp(`^[-*+]\\s+(${matchPrefixes.join('|')}):`, 'i')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (/^---+$/.test(line)) {
      cutIndex = i
      break
    }

    if (prefixRegex.test(line)) {
      hasMatchingItem = true
    }
  }

  if (cutIndex >= 0 && hasMatchingItem) {
    return lines.slice(cutIndex + 1).join('\n').trim()
  }

  return md
}

export function fixLocalAssetPaths(mdContent, dirPath) {
  return mdContent.replace(/(!\[.*?\]\()(\.\/|\.\.\/|[^\/].*?)(\))/g, (match, prefix, relativePath, suffix) => {
    if (/^(https?:)?\/\//.test(relativePath)) return match

    const normalized = relativePath.replace(/^\.?\//, '')
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

    const match = /^[-*+]\s*(.+?):\s*(.+)$/.exec(line)
    if (match) {
      const label = match[1].trim().toLowerCase()
      const value = match[2].trim()

      const mappedKey = labelMap[label]
      if (mappedKey) {
        if (mappedKey === 'tags') {
          if (!result.tags) result.tags = []
          result.tags.push(value)
        } else if (mappedKey === 'created_time' && !result.created_time) {
          result.created_time = value
        } else {
          result[mappedKey] = value
        }
      }
    }
  }

  if (!result.created_time) result.created_time = ''
  if (!result.tags) result.tags = []

  return result
}