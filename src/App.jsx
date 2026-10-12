import { useEffect, useRef, useState } from 'react'
import en from './content/en.js'
import LessonArt from './LessonArt.jsx'
import vi from './content/vi.js'
import { countDone, load, save } from './progress.js'
import Quiz from './Quiz.jsx'
import { parseHash } from './route.js'

const CONTENT = { en, vi }

export default function App() {
  const [state, setState] = useState(load)
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    save(state)
    document.documentElement.lang = state.lang
  }, [state])

  // Move focus to the new screen's heading so keyboard and screen-reader users land on it.
  const firstRoute = useRef(route)
  useEffect(() => {
    if (route === firstRoute.current) return
    const heading = document.querySelector('main h1')
    heading.tabIndex = -1
    heading.focus()
  }, [route])

  useEffect(() => {
    const heading = document.querySelector('main h1').textContent
    const { appName } = CONTENT[state.lang].ui
    document.title = heading === appName ? appName : `${heading} · ${appName}`
  }, [route, state.lang])

  const { ui, levels } = CONTENT[state.lang]
  const otherLang = state.lang === 'en' ? 'vi' : 'en'

  const level =
    route.screen === 'level'
      ? levels.find((l) => l.id === route.id)
      : levels.find((l) => l.lessons.some((lesson) => lesson.id === route.id))
  const lesson = route.screen === 'lesson' ? level?.lessons.find((l) => l.id === route.id) : null

  const markDone = (id) =>
    setState((s) => (s.completed.includes(id) ? s : { ...s, completed: [...s.completed, id] }))

  let screen
  if (route.screen === 'lesson' && lesson) {
    const next = level.lessons[level.lessons.indexOf(lesson) + 1]
    screen = (
      <article className={`lesson tone-${level.id}`}>
        <a className="back" href={`#/level/${level.id}`}>
          ← {level.title}
        </a>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>
        <LessonArt id={lesson.id} className="art-hero" />
        {lesson.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <Quiz key={lesson.id} questions={lesson.quiz} ui={ui} onPass={() => markDone(lesson.id)}>
          <nav className="after-quiz">
            {next && (
              <a className="button" href={`#/lesson/${next.id}`}>
                {ui.nextLesson}: {next.title} →
              </a>
            )}
            <a href={`#/level/${level.id}`}>{ui.backToLevel}</a>
          </nav>
        </Quiz>
      </article>
    )
  } else if (route.screen === 'level' && level) {
    screen = (
      <div className={`tone-${level.id}`}>
        <a className="back" href="#/">
          ← {ui.backHome}
        </a>
        <h1>{level.title}</h1>
        <p className="lead">{level.description}</p>
        <ol className="lesson-list">
          {level.lessons.map((l) => (
            <li key={l.id}>
              <a href={`#/lesson/${l.id}`}>
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-summary">{l.summary}</span>
                {state.completed.includes(l.id) && <span className="done">✓ {ui.completed}</span>}
                <LessonArt id={l.id} className="art-thumb" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    )
  } else {
    screen = (
      <>
        <h1 className="hero">{ui.appName}</h1>
        <p className="lead">{ui.tagline}</p>
        <ol className="levels">
          {levels.map((l) => {
            const done = countDone(l.lessons, state.completed)
            return (
              <li key={l.id} className={`tone-${l.id}`}>
                <a className="level-card" href={`#/level/${l.id}`}>
                  <h2>{l.title}</h2>
                  <p>{l.description}</p>
                  <progress value={done} max={l.lessons.length} aria-label={l.title} />
                  <p className="progress-text">{ui.progress(done, l.lessons.length)}</p>
                </a>
              </li>
            )
          })}
        </ol>
      </>
    )
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#/">
          {ui.appName}
        </a>
        <button
          type="button"
          className="lang-switch"
          lang={otherLang}
          onClick={() => setState((s) => ({ ...s, lang: otherLang }))}
        >
          {CONTENT[otherLang].ui.langName}
        </button>
      </header>
      <main>{screen}</main>
    </>
  )
}
