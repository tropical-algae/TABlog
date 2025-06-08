import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { extractMetadataFromMarkdown, fixLocalAssetPaths, removeMetadataFromMarkdown } from './markdownProcess.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, '../')

const markdownDir = path.join(publicDir, 'markdowns')
const processedDir = path.join(publicDir, 'markdowns_processed')
const configPath = path.join(publicDir, 'config/app.json')
const indexFile = path.join(processedDir, 'index.json')

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const mdLabelMap = config.md_lables || {}
const mdLableName = Object.values(mdLabelMap)

const reverseLabelMap = Object.entries(mdLabelMap).reduce((acc, [key, value]) => {
  acc[value.toLowerCase()] = key
  return acc
}, {})

const allFiles = getAllFiles(markdownDir)
const indexData = []

function getAllFiles(dir, fileList = []) {
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

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
}

async function clearDirectory(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    // 跳过 . 开头的隐藏文件或目录
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await fs.promises.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.promises.unlink(fullPath);
    }
  }
}

ensureDirExists(processedDir)
clearDirectory(processedDir)
  .then(() => console.log('✅ Directory cleared!'))
  .catch(err => console.error('❌ Error clearing directory:', err));

for (const filePath of allFiles) {
  // const relativePathFromPublic = path.relative(publicDir, filePath)
  const targetPath = path.join(processedDir, path.relative(markdownDir, filePath))
  const dirPath = '/' + path.dirname(path.relative(publicDir, targetPath)).replace(/\\/g, '/')
  const slug = path.basename(filePath)

  ensureDirExists(targetPath)

  if (filePath.endsWith('.md')) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fixedContent = fixLocalAssetPaths(content, dirPath)
    const metadata = extractMetadataFromMarkdown(fixedContent, reverseLabelMap)

    const cleanedContent = removeMetadataFromMarkdown(fixedContent, mdLableName)
    fs.writeFileSync(targetPath, cleanedContent, 'utf-8')

    indexData.push({
      title: slug.replace(/\.md$/, ''),
      slug,
      dir: dirPath,
      ...metadata
    })
  } else {
    fs.copyFileSync(filePath, targetPath)
  }
}

fs.mkdirSync(path.dirname(indexFile), { recursive: true })
fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), 'utf-8')

console.log('✅ All markdowns processed and index.json generated.')