import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { extractMetadataFromMarkdown, fixLocalAssetPaths, removeMetadataFromMarkdown } from './markdownProcess.js'
import { getAllFiles, ensureDirExists, clearDirectory, stripMarkdownAndImageExtensions } from './fileTools.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, '../')

const markdownDir = path.join(publicDir, 'markdowns')
const processedDir = path.join(publicDir, 'markdowns_processed')
const configPath = path.join(publicDir, 'config/app.json')
const indexFile = path.join(processedDir, 'index.json')
const excludedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'md']

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const mdLabelMap = config.md_labels || {}
const mdLabelName = Object.values(mdLabelMap)

const reverseLabelMap = Object.entries(mdLabelMap).reduce((acc, [key, value]) => {
  acc[value.toLowerCase()] = key
  return acc
}, {})

const allFiles = getAllFiles(markdownDir)
const indexData = []

ensureDirExists(processedDir)
clearDirectory(processedDir)
console.log('✅ Directory cleared!')

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

    const cleanedContent = removeMetadataFromMarkdown(fixedContent, mdLabelName)
    fs.writeFileSync(targetPath, cleanedContent, 'utf-8')

    indexData.push({
      title: stripMarkdownAndImageExtensions(slug, excludedExtensions), // slug.replace(/\.md$/, ''),
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