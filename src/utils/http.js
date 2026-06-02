export async function fetchOk(sourcePath, options) {
  if (!sourcePath) {
    throw new Error("Missing resource path")
  }

  const res = await fetch(sourcePath, options)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText} (${sourcePath})`)
  }

  return res
}
