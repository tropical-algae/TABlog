import path from 'path'


/**
 * 修复markdown中对本地资源的引用路径
 * markdown与引用文件全部迁移至新路径且要在前端渲染，故要替换新的（前端资源）路径
 * @param {*} mdText markdown文本
 * @param {*} originFile 原始文件路径
 * @param {*} sourcePath （前端中）文件的资源父路径
 * @param {*} fileMap 全部新旧文件的绝对路径映射
 * @returns 修复后的markdown文本
 */
export function fixMdAssetsRef(mdText, originFile, sourcePath, fileMap) {
  // 获取前端访问的资源路径
  return mdText.replace(/(!\[.*?\]\()([^\)]+)(\))/g, (match, prefix, imgPath, suffix) => {
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
    let relativeToProcessed = path.join(sourcePath, path.basename(newAbsPath))
    return `${prefix}${relativeToProcessed}${suffix}`
  })
}


/**
 * 抽取markdown中定义的元信息（标签信息）
 * @param {*} mdText markdown文本
 * @param {*} labelMap 标签名的映射
 * @returns 标签与值的映射
 */
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

/**
 * 移除markdown中的定义的元信息（标签信息）
 * @param {*} mdText markdown文本
 * @param {*} matchPrefixes 标签名列表
 * @returns 移除元信息后的markdown
 */
export function removeMdMetadata(mdText, matchPrefixes = []) {
  const lines = mdText.split('\n')
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

  return mdText
}
