import fs from 'fs'
import path from 'path'

export function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList)
    } else {
      fileList.push(fullPath)
    }
  }
  return fileList
}
    
export function ensureDirExists(filePath) {
  const dir = path.dirname(filePath)
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

export function stripMarkdownAndImageExtensions(filename, excludedExtensions) {
  const parts = filename.split('.')
  if (parts.length === 1) return filename
  let i = parts.length - 1
  if (parts[i] === 'md') {
    i--
  }
  while (i > 0 && excludedExtensions.includes(parts[i])) {
    i--
  }
  return parts.slice(0, i + 1).join('.')
}