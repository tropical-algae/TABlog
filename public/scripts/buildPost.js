import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { 
  getFiles, 
  sortFiles,
  clearDirectory, 
  movePosts,
  moveConfig,
  buildPostIndex
} from './fileProcessor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, '../')
const originMdDir = path.join(publicDir, 'markdowns')
const newMdDir = path.join(publicDir, 'markdowns_processed')
const originCfgDir = path.join(publicDir, 'config')
const newCfgDir = path.join(publicDir, 'config_processed')

const config = JSON.parse(fs.readFileSync(path.join(originCfgDir, 'app.json'), 'utf-8'))

// 获取全部文件列表，并排序（md排最后）
const sortedPostFiles = sortFiles(getFiles(originMdDir))

clearDirectory(newMdDir)
clearDirectory(newCfgDir)
console.log('✅ Directory cleared!')

// 预处理post
const indexData = movePosts(config, sortedPostFiles, publicDir, originMdDir, newMdDir)
const indexMap = buildPostIndex(publicDir, newMdDir, indexData)

// 预处理config
const configMap = moveConfig(publicDir, originCfgDir, newCfgDir)

const mergedMap = { ...indexMap, ...configMap }
fs.writeFileSync(path.join(newCfgDir, "map.json"), JSON.stringify(mergedMap, null, 2), 'utf-8')

console.log('✅ All markdowns processed and index.json generated.')