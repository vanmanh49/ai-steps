export function parseHash(hash) {
  const match = /^#\/(level|lesson)\/([^/]+)$/.exec(hash)
  return match ? { screen: match[1], id: match[2] } : { screen: 'home' }
}
