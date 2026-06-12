import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { fixMdAssetsRef } from '../public/scripts/mdProcessor.js'
import {
  clearDirectory,
  getFiles,
  makePostTitlesUnique,
  movePosts,
  sortFiles
} from '../public/scripts/fileProcessor.js'

const publicDir = path.resolve('/app/public')
const originFile = path.join(publicDir, 'markdowns/posts/nested/article.md')

function rewrite(markdown, sourceAsset, processedAsset) {
  return fixMdAssetsRef(markdown, originFile, publicDir, {
    [path.resolve(sourceAsset)]: path.resolve(processedAsset)
  })
}

test('rewrites an image in the same directory', () => {
  const result = rewrite(
    '![same](./image.png)',
    path.join(publicDir, 'markdowns/posts/nested/image.png'),
    path.join(publicDir, 'markdowns_processed/posts/nested/image-abcd1234.png')
  )

  assert.equal(result, '![same](/markdowns_processed/posts/nested/image-abcd1234.png)')
})

test('rewrites an image in a sibling directory using its processed location', () => {
  const result = rewrite(
    '![sibling](../../assets/image.png)',
    path.join(publicDir, 'markdowns/assets/image.png'),
    path.join(publicDir, 'markdowns_processed/assets/image-abcd1234.png')
  )

  assert.equal(result, '![sibling](/markdowns_processed/assets/image-abcd1234.png)')
})

test('rewrites an image in a deeper directory using its processed location', () => {
  const result = rewrite(
    '![deep](./assets/diagrams/image.png)',
    path.join(publicDir, 'markdowns/posts/nested/assets/diagrams/image.png'),
    path.join(publicDir, 'markdowns_processed/posts/nested/assets/diagrams/image-abcd1234.png')
  )

  assert.equal(
    result,
    '![deep](/markdowns_processed/posts/nested/assets/diagrams/image-abcd1234.png)'
  )
})

test('leaves remote and missing images unchanged', () => {
  const markdown = [
    '![remote](https://example.com/image.png)',
    '![protocol-relative](//example.com/image.png)',
    '![public-root](/image.png)',
    '![missing](./missing.png)'
  ].join('\n')

  assert.equal(fixMdAssetsRef(markdown, originFile, publicDir, {}), markdown)
})

test('adds stable suffixes to duplicate post titles', () => {
  assert.deepEqual(
    makePostTitlesUnique([
      { title: 'note', dir: '/first' },
      { title: 'note', dir: '/second' },
      { title: 'other', dir: '/third' }
    ]),
    [
      { title: 'note #1', dir: '/first' },
      { title: 'note #2', dir: '/second' },
      { title: 'other', dir: '/third' }
    ]
  )
})

test('avoids collisions with original post titles when adding suffixes', () => {
  assert.deepEqual(
    makePostTitlesUnique([
      { title: 'note', dir: '/first' },
      { title: 'note', dir: '/second' },
      { title: 'note #1', dir: '/third' }
    ]),
    [
      { title: 'note #2', dir: '/first' },
      { title: 'note #3', dir: '/second' },
      { title: 'note #1', dir: '/third' }
    ]
  )
})

test('clearDirectory creates the target directory when it does not exist', (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tablog-clear-'))
  const targetDir = path.join(tempDir, 'missing/processed')

  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

  clearDirectory(targetDir)

  assert.ok(fs.statSync(targetDir).isDirectory())
})

test('movePosts rewrites nested Markdown asset paths using generated locations', (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tablog-md-'))
  const testPublicDir = path.join(tempDir, 'public')
  const markdownDir = path.join(testPublicDir, 'markdowns')
  const processedDir = path.join(testPublicDir, 'markdowns_processed')
  const articleFile = path.join(markdownDir, 'aaaa/bbbbb/article.md')
  const assets = [
    ['asd.png', 'root'],
    ['aaaa/asssd.png', 'parent'],
    ['aaaa/bbbbb/sdsd/asssd.png', 'child']
  ]

  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

  fs.mkdirSync(path.dirname(articleFile), { recursive: true })
  fs.mkdirSync(processedDir, { recursive: true })
  for (const [asset, content] of assets) {
    const assetFile = path.join(markdownDir, asset)
    fs.mkdirSync(path.dirname(assetFile), { recursive: true })
    fs.writeFileSync(assetFile, content)
  }
  fs.writeFileSync(
    articleFile,
    ['![root](../../asd.png)', '![parent](../asssd.png)', '![child](./sdsd/asssd.png)'].join('\n')
  )

  const posts = movePosts(
    {},
    sortFiles(getFiles(markdownDir)),
    testPublicDir,
    markdownDir,
    processedDir
  )
  const article = fs.readFileSync(
    path.join(posts[0].dir.replace(/^\//, `${testPublicDir}/`), posts[0].slug),
    'utf8'
  )
  const [rootAsset] = fs.readdirSync(processedDir).filter((file) => file.endsWith('.png'))
  const [parentAsset] = fs
    .readdirSync(path.join(processedDir, 'aaaa'))
    .filter((file) => file.endsWith('.png'))
  const [childAsset] = fs.readdirSync(path.join(processedDir, 'aaaa/bbbbb/sdsd'))

  assert.equal(
    article,
    [
      `![root](/markdowns_processed/${rootAsset})`,
      `![parent](/markdowns_processed/aaaa/${parentAsset})`,
      `![child](/markdowns_processed/aaaa/bbbbb/sdsd/${childAsset})`
    ].join('\n')
  )
  assert.ok(fs.existsSync(path.join(processedDir, rootAsset)))
  assert.ok(fs.existsSync(path.join(processedDir, 'aaaa', parentAsset)))
  assert.ok(fs.existsSync(path.join(processedDir, 'aaaa/bbbbb/sdsd', childAsset)))
})

test('movePosts disambiguates same-named Markdown files in nested directories', (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tablog-md-'))
  const testPublicDir = path.join(tempDir, 'public')
  const markdownDir = path.join(testPublicDir, 'markdowns')
  const processedDir = path.join(testPublicDir, 'markdowns_processed')

  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

  fs.mkdirSync(path.join(markdownDir, 'first'), { recursive: true })
  fs.mkdirSync(path.join(markdownDir, 'second'), { recursive: true })
  fs.mkdirSync(processedDir, { recursive: true })
  fs.writeFileSync(path.join(markdownDir, 'first/note.md'), 'first')
  fs.writeFileSync(path.join(markdownDir, 'second/note.md'), 'second')

  const posts = movePosts(
    {},
    sortFiles(getFiles(markdownDir)),
    testPublicDir,
    markdownDir,
    processedDir
  )

  assert.deepEqual(
    posts.map((post) => post.title),
    ['note #1', 'note #2']
  )
  assert.notEqual(posts[0].dir, posts[1].dir)
})
