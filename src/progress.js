const KEY = 'ai-learn'
const LANGS = ['en', 'vi']

export function parse(raw) {
  let stored
  try {
    stored = JSON.parse(raw)
  } catch {
    stored = null
  }
  const completed = Array.isArray(stored?.completed)
    ? [...new Set(stored.completed.filter((id) => typeof id === 'string'))]
    : []
  return { lang: LANGS.includes(stored?.lang) ? stored.lang : 'en', completed }
}

export function load() {
  try {
    return parse(localStorage.getItem(KEY))
  } catch {
    return parse(null)
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage is blocked or full: the app keeps working, progress just does not persist.
  }
}

export function countDone(lessons, completed) {
  return lessons.filter((lesson) => completed.includes(lesson.id)).length
}
