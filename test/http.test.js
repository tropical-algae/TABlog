import assert from 'node:assert/strict'
import test from 'node:test'

import { fetchOk } from '../src/utils/http.js'

test('fetchOk returns successful responses', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  const response = { ok: true }
  globalThis.fetch = async () => response

  assert.equal(await fetchOk('/config.json'), response)
})

test('fetchOk rejects missing resource paths', async () => {
  await assert.rejects(() => fetchOk(null), /Missing resource path/)
})

test('fetchOk rejects unsuccessful responses', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => ({
    ok: false,
    status: 404,
    statusText: 'Not Found'
  })

  await assert.rejects(
    () => fetchOk('/missing.json'),
    /Request failed: 404 Not Found \(\/missing\.json\)/
  )
})
