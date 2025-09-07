import fs from 'fs'
import path from 'path'
import crypto from "crypto"
import { 
  extractMdMetadata, 
  fixMdAssetsRef, 
  removeMdMetadata, 
} from './mdProcessor.js'


export function getFileHash(filePath, algorithm = 'sha256', length = 8) {
  const buffer = fs.readFileSync(filePath)
  const hash = crypto.createHash(algorithm)  //（md5/sha1/sha256）
  hash.update(buffer)
  return hash.digest("hex").slice(0, length)
}

export function getTextHash(text, algorithm = 'sha256', length = 8) {
  const hash = crypto.createHash(algorithm)  //（md5/sha1/sha256）
  hash.update(text, "utf8")
  return hash.digest("hex").slice(0, length)
}

// 计算新文件的父路径
export function getNewParentDir(originFile, originDir, newDir) {
  const relPath = path.relative(originDir, originFile)
  const relDir = path.dirname(relPath)
  return path.join(newDir, relDir)
}

// 基于 原文件/新文本 生成新路径
export function getNewHashedPath(originFile, newParentDir, newContent = null) {
  const hash = newContent 
    ? getTextHash(newContent, 'md5')
    : getFileHash(originFile, 'md5')
  const ext = path.extname(originFile)
  const base = path.basename(originFile, ext)

  const newName = `${base}-${hash}${ext}`
  return path.join(newParentDir, newName)
}

export function getFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      getFiles(fullPath, fileList)
    } else {
      fileList.push(fullPath)
    }
  }
  return fileList
}

export function sortFiles(files) {
  return files.sort((a, b) => {
    const isAMd = a.toLowerCase().endsWith('.md')
    const isBMd = b.toLowerCase().endsWith('.md')

    if (isAMd && !isBMd) return 1   // a 是 md，b 不是 → a 放后面
    if (!isAMd && isBMd) return -1  // b 是 md，a 不是 → b 放后面
    return a.localeCompare(b)       // 否则按字母序
  })
}

// 为文件父目录创建文件夹
export function ensureDirExists(filepath) {
  const dir = path.dirname(filepath)
  fs.mkdirSync(dir, { recursive: true })
}

export function clearDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // 跳过隐藏文件/目录

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

/**
 * 获取文件名（去除hash、去除多后缀干扰）
 */
export function getFileRealName(filename, excludedExtensions) {
  // 去除连续的后缀
  const parts = filename.split('.')
  if (parts.length === 1) return filename
  let i = parts.length - 1
  if (parts[i] === 'md') {
    i--
  }
  while (i > 0 && excludedExtensions.includes(parts[i])) {
    i--
  }
  // 去除hash
  const fullname = parts.slice(0, i + 1).join('.')
  const lastIndex = fullname.lastIndexOf("-")
  if (lastIndex === -1) return fullname
  return fullname.slice(0, lastIndex)
}

export function movePosts(config, sortedFiles, publicDir, originDir, newDir) {
  const indexData = []
  // 旧数据与新数据的映射表
  const fileMap = {}

  const mdLabelMap = config.md_labels || {}
  const mdLabelName = Object.values(mdLabelMap)
  const reverseLabelMap = Object.entries(mdLabelMap).reduce((acc, [key, value]) => {
    acc[value.toLowerCase()] = key
    return acc
  }, {})
  const excludedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'md']

  for (const originFile of sortedFiles) {
    const isMarkdown = originFile.endsWith(".md")
    const newParentDir = getNewParentDir(originFile, originDir, newDir)
    const content = isMarkdown ? fs.readFileSync(originFile, "utf-8") : null
    const newFile = isMarkdown
      ? getNewHashedPath(originFile, newParentDir, content)
      : getNewHashedPath(originFile, newParentDir)

    ensureDirExists(newFile)

    if (isMarkdown) {
      const sourceDir = "/" + path.relative(publicDir, newParentDir).replace(/\\/g, "/")
      const fixedContent = fixMdAssetsRef(content, originFile, sourceDir, fileMap)
      const finalContent = removeMdMetadata(fixedContent, mdLabelName)
    
      fs.writeFileSync(newFile, finalContent, "utf-8")

      const metadata = extractMdMetadata(fixedContent, reverseLabelMap)
      indexData.push({
        title: getFileRealName(path.basename(newFile), excludedExtensions),
        slug: path.basename(newFile),
        dir: sourceDir,
        ...metadata,
      })
    } else {
      fs.copyFileSync(originFile, newFile)
    }

    fileMap[path.resolve(originFile)] = path.resolve(newFile)
  }
  return indexData
}

export function moveConfig(publicDir, originDir, newDir) {
  const map = {}
  const files = getFiles(originDir)
  for (const originFile of files) {
    const newParentDir = getNewParentDir(originFile, originDir, newDir)
    const newFile = getNewHashedPath(originFile, newParentDir)
    const sourceFile = "/" + path.relative(publicDir, newFile).replace(/\\/g, "/")
    fs.copyFileSync(originFile, newFile)

    map[path.basename(originFile, path.extname(originFile))] = sourceFile
  }
  return map
}

export function buildPostIndex(publicDir, newDir, indexData) {
  const indexHash = getTextHash(JSON.stringify(indexData), "md5")
  const indexFile = path.join(newDir, `index-${indexHash}.json`)
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), 'utf-8')

  return {"index": "/" + path.relative(publicDir, indexFile).replace(/\\/g, "/")}
}