const motionEntries = new Map()
let activeMotionKey = ''

function normalizeKey(key) {
  return key || activeMotionKey || '__default__'
}

function createDeferredEntry(resolved = false) {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })

  const entry = {
    promise,
    resolved: false,
    resolve: () => {
      if (entry.resolved) return
      entry.resolved = true
      resolve()
    }
  }

  if (resolved) {
    entry.resolve()
  }

  return entry
}

function ensureMotionEntry(key, resolved = false) {
  const motionKey = normalizeKey(key)
  let entry = motionEntries.get(motionKey)

  if (!entry) {
    entry = createDeferredEntry(resolved)
    motionEntries.set(motionKey, entry)
  }

  return { motionKey, entry }
}

export function beginPageMotion(key) {
  activeMotionKey = normalizeKey(key)

  for (const [motionKey, entry] of motionEntries) {
    if (motionKey !== activeMotionKey) {
      entry.resolve()
      motionEntries.delete(motionKey)
    }
  }

  motionEntries.get(activeMotionKey)?.resolve()
  motionEntries.set(activeMotionKey, createDeferredEntry())
}

export function startPageMotion(key) {
  const { entry } = ensureMotionEntry(key, true)
  entry.resolve()
}

export function waitForPageMotionStart(key) {
  const { entry } = ensureMotionEntry(key, true)
  return entry.promise
}
