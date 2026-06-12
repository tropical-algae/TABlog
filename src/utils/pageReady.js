const readyEntries = new Map()
let activeReadyKey = ''

function normalizeKey(key) {
  return key || activeReadyKey || '__default__'
}

function createAbortError() {
  return new DOMException('Page ready task aborted', 'AbortError')
}

function ensureReadyEntry(key) {
  const readyKey = normalizeKey(key)
  let entry = readyEntries.get(readyKey)

  if (!entry || entry.signal.aborted) {
    const controller = new AbortController()
    entry = {
      controller,
      signal: controller.signal,
      promise: Promise.resolve()
    }
    readyEntries.set(readyKey, entry)
  }

  return { readyKey, entry }
}

function abortReadyEntry(entry) {
  if (!entry.signal.aborted) {
    entry.controller.abort(createAbortError())
  }
}

export function beginPageReady(key) {
  activeReadyKey = normalizeKey(key)

  for (const [readyKey, entry] of readyEntries) {
    if (readyKey !== activeReadyKey) {
      abortReadyEntry(entry)
      readyEntries.delete(readyKey)
    }
  }

  ensureReadyEntry(activeReadyKey)
}

export function registerPageReady(task, key) {
  const { readyKey, entry } = ensureReadyEntry(key)
  const readyTask = typeof task === 'function' ? task(entry.signal) : task
  const readyPromise = Promise.resolve(readyTask).catch((err) => {
    if (err?.name !== 'AbortError') {
      console.error('[page ready error]', err)
    }
  })

  entry.promise = readyPromise
  readyEntries.set(readyKey, entry)
  return readyPromise
}

export function consumePageReady(key) {
  const { readyKey, entry } = ensureReadyEntry(key)

  return entry.promise.finally(() => {
    if (readyEntries.get(readyKey) === entry) {
      readyEntries.delete(readyKey)
    }
  })
}

export function cancelPageReady(key) {
  const readyKey = normalizeKey(key)
  const entry = readyEntries.get(readyKey)
  if (!entry) return

  abortReadyEntry(entry)
  readyEntries.delete(readyKey)
}
