import path from 'path'


export function removeMdMetadata(md, matchPrefixes = []) {
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

export function fixMdAssetsRef(mdContent, originFile, dirPath, fileMap) {
  // 获取前端访问的资源路径
  return mdContent.replace(/(!\[.*?\]\()([^\)]+)(\))/g, (match, prefix, imgPath, suffix) => {
    if (/^(https?:)?\/\//.test(imgPath)) return match

    // 获取引用文件绝对路径
    let originAbsPath
    if (imgPath.startsWith("/")) {
      originAbsPath = imgPath
    } else {
      originAbsPath = path.resolve(path.dirname(originFile), imgPath)
    }

    // 查找映射表获取移动后的文件
    const newAbsPath = fileMap[originAbsPath]
    if (!newAbsPath) {
      return match
    }
    let relativeToProcessed = path.join(dirPath, path.basename(newAbsPath))
    return `${prefix}${relativeToProcessed}${suffix}`
  })
}

export function extractMdMetadata(mdText, labelMap) {
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