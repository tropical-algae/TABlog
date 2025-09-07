import fs from 'fs'
import path from 'path'
import crypto from "crypto"
import { 
  extractMdMetadata, 
  fixMdAssetsRef, 
  removeMdMetadata, 
} from './mdProcessor.js'

/**
 * 计算文件hash
 * @param {*} filePath 文件地址
 * @param {*} algorithm 算法类型
 * @param {*} length hash长度
 * @returns 文件hash
 */
export function getFileHash(filePath, algorithm = 'sha256', length = 8) {
  const buffer = fs.readFileSync(filePath)
  const hash = crypto.createHash(algorithm)  //（md5/sha1/sha256）
  hash.update(buffer)
  return hash.digest("hex").slice(0, length)
}

/**
 * 计算文本hash
 * @param {*} text 文本
 * @param {*} algorithm 算法类型
 * @param {*} length hash长度
 * @returns 文本hash
 */
export function getTextHash(text, algorithm = 'sha256', length = 8) {
  const hash = crypto.createHash(algorithm)  //（md5/sha1/sha256）
  hash.update(text, "utf8")
  return hash.digest("hex").slice(0, length)
}

/**
 * 获取文件在新路径下的父目录
 * @param {*} originFile 原始文件路径
 * @param {*} originDir 原始文件根路径
 * @param {*} newDir 新的根路径
 * @returns 文件在新路径下的父目录
 */
export function getNewParentDir(originFile, originDir, newDir) {
  const relPath = path.relative(originDir, originFile)
  const relDir = path.dirname(relPath)
  return path.join(newDir, relDir)
}

/**
 * 获取原始文件在新目录下带有hash的文件路径
 * @param {*} originFile 原始文件路径
 * @param {*} newParentDir 文件在新路径下的父目录
 * @param {*} newContent 文件内容。若非空，则以该参数计算hash
 * @returns 带有hash的新文件路径
 */
export function getNewHashedPath(originFile, newParentDir, newContent = null) {
  const hash = newContent 
    ? getTextHash(newContent, 'md5')
    : getFileHash(originFile, 'md5')
  const ext = path.extname(originFile)
  const base = path.basename(originFile, ext)

  const newName = `${base}-${hash}${ext}`
  return path.join(newParentDir, newName)
}

/**
 * 递归获取目录下全部文件
 * @param {*} dir 目录
 * @param {*} fileList 已收集的文件列表，用于递归
 * @returns 文件列表
 */
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

/**
 * 文件排序，将md文件排在最后
 * @param {*} files 文件路径列表
 * @returns 排序后的文件路径列表
 */
export function sortFiles(files) {
  return files.sort((a, b) => {
    const isAMd = a.toLowerCase().endsWith('.md')
    const isBMd = b.toLowerCase().endsWith('.md')

    if (isAMd && !isBMd) return 1
    if (!isAMd && isBMd) return -1
    return a.localeCompare(b)
  })
}

/**
 * 为文件父目录创建文件夹
 * @param {*} filepath 文件路径
 */
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
 * 获取文件名（去除hash、去除连续后缀干扰）
 * @param {*} filename 含hash与后缀的文件全名。e.g file-8sdf82.md
 * @param {*} suffixes 后缀词黑名单
 * @returns 
 */
export function getFileRealName(filename, suffixes) {
  // 去除连续的后缀
  const parts = filename.split('.')
  if (parts.length === 1) return filename
  let i = parts.length - 1
  if (parts[i] === 'md') {
    i--
  }
  while (i > 0 && suffixes.includes(parts[i])) {
    i--
  }
  // 去除hash
  const fullname = parts.slice(0, i + 1).join('.')
  const lastIndex = fullname.lastIndexOf("-")
  if (lastIndex === -1) return fullname
  return fullname.slice(0, lastIndex)
}

/**
 * 将路径下的全部markdown文件添加hash，标准化并迁移到新路径下存储
 * @param {*} config 服务配置
 * @param {*} sortedFiles 排序后的（md文件在后）文件列表（含md与其他资源文件）
 * @param {*} publicDir public目录路径
 * @param {*} originDir 原始文件根路径
 * @param {*} newDir 新的根路径
 * @returns 全部markdown的元信息
 */
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
  const suffixes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'md']

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
        title: getFileRealName(path.basename(newFile), suffixes),
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

/**
 * 将路径下的配置文件计算hash，并迁移到新路径下存储
 * @param {*} publicDir public目录路径
 * @param {*} originDir 原始文件根路径
 * @param {*} newDir 新的根路径
 * @returns 配置名与新文件的（前端）资源地址的映射
 */
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

/**
 * 构建markdown的索引文件
 * @param {*} publicDir public目录路径
 * @param {*} newDir 新的根路径
 * @param {*} indexData 全部markdown的元信息
 * @returns 配置名与新文件的（前端）资源地址的映射
 */
export function buildPostIndex(publicDir, newDir, indexData) {
  const indexHash = getTextHash(JSON.stringify(indexData), "md5")
  const indexFile = path.join(newDir, `index-${indexHash}.json`)
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), 'utf-8')

  return {"index": "/" + path.relative(publicDir, indexFile).replace(/\\/g, "/")}
}