# AI Learning App Implementation Plan

Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A bilingual (English/Vietnamese) web app with twelve lessons on AI
and AI agents across three levels, each lesson ending in a quiz, with progress
saved in the browser.

**Architecture:** A static React single-page app. All lesson text lives in two
data files with an identical shape; components render whichever language is
selected. Screens are switched by URL hash. Pure logic (stored-state parsing,
hash parsing) lives outside components so it can be tested with `node --test`.

**Tech Stack:** React, Vite, plain CSS, Node's built-in test runner.

**Spec:** `docs/specs/2026-10-12-ai-learning-app-design.md`

## Global Constraints

- Runtime dependencies: `react` and `react-dom` only. No router, UI or state library.
- No backend, no network calls, no API key.
- Levels, in order: `beginner`, `intermediate`, `advanced`. None locked.
- Lesson ids, in order, are the twelve listed in the spec's Curriculum table.
- Every lesson: 3 to 5 sections, exactly 4 quiz questions, exactly 4 options each.
- Pass mark: 3 correct out of 4.
- `localStorage` key: `ai-learn`. Stored value: `{ lang, completed }`.
- Languages: `en` (default) and `vi`.
- Tests run with `npm test`, which runs `node --test src`.
- Commit messages and code comments are plain engineering notes.

## Review Focus

1. Stored state is missing, not JSON, or the wrong shape (for example
   `completed` is a string): the app starts with defaults instead of crashing.
   Pinned in Task 2.
2. `localStorage` throws (private window, blocked storage): the app still
   works, progress simply does not persist. Pinned in Task 2.
3. `completed` holds ids that no longer exist or holds duplicates: a level's
   progress never shows more than 4 of 4. Pinned in Task 2.
4. The hash is unknown, or names a level or lesson that does not exist: Home
   is shown. Pinned in Task 3 (parsing) and checked by hand in Task 5.
5. The learner moves from one lesson to the next, or switches language
   mid-quiz: a new lesson starts with a fresh quiz; a language switch keeps
   the answers already given. Checked by hand in Task 5.

---

### Task 1: Project scaffold and lesson content

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `.gitignore` (Vite React template)
- Create: `src/content/en.js`, `src/content/vi.js`
- Test: `src/content/content.test.js`

**Interfaces:**
- Produces: each content file has `export default { ui, levels }`.
  - `levels: [{ id, title, description, lessons: [{ id, title, summary, sections: [{ heading, body }], quiz: [{ question, options: string[4], answer: 0..3, explanation }] }] }]`
  - `ui` keys, all strings unless noted: `appName`, `tagline`, `langName`,
    `progress(done, total)` (function returning a string), `completed`,
    `quizTitle`, `question(n, total)` (function), `correct`, `incorrect`,
    `score(n, total)` (function), `passed`, `failed`, `retry`, `nextLesson`,
    `backToLevel`, `backHome`.

- [ ] **Step 1: Scaffold.** Run `npm create vite@latest . -- --template react`
  in the project root, then `npm install`. Delete the template's demo assets,
  `src/App.css` and `src/index.css`. Add `"test": "node --test src"` to
  `package.json` scripts. Remove the template's ESLint config and its
  dev dependencies.

- [ ] **Step 2: Write the failing test** in `src/content/content.test.js`,
  importing both content files. Tests:
  - `languages have the same level and lesson ids`: the list of
    `levelId/lessonId` strings is deep-equal between `en` and `vi`, and equals
    the twelve ids in the spec's order under `beginner`, `intermediate`, `advanced`.
  - `every lesson has 3 to 5 sections and 4 questions with 4 options`: for both languages.
  - `every answer index is 0 to 3 and matches across languages`.
  - `ui has the same keys in both languages`: sorted `Object.keys(ui)` are deep-equal.
  - `no empty text`: every title, summary, heading, body, question, option and
    explanation is a non-empty string.

- [ ] **Step 3: Run `npm test`.** Expected: FAIL, content modules not found.

- [ ] **Step 4: Write `src/content/en.js`** with all twelve lessons. Plain
  language, short paragraphs, an everyday analogy per lesson, no jargon left
  undefined at Beginner level. Vary which option index is correct.

- [ ] **Step 5: Write `src/content/vi.js`**, a natural Vietnamese rendering of
  the same lessons with the same ids, option order and `answer` indices.

- [ ] **Step 6: Run `npm test`.** Expected: all content tests PASS.

- [ ] **Step 7: Commit** as `Scaffold app and add bilingual lesson content`.

### Task 2: Saved progress

**Files:**
- Create: `src/progress.js`
- Test: `src/progress.test.js`

**Interfaces:**
- Produces:
  - `parse(raw: string | null): { lang: 'en' | 'vi', completed: string[] }`
  - `load(): { lang, completed }` reads key `ai-learn` and returns `parse` of it.
  - `save(state): void` writes key `ai-learn`.
  - `countDone(lessons: { id }[], completed: string[]): number`, the number
    of the given lessons whose id is in `completed`.

- [ ] **Step 1: Write the failing tests:**
  - `parse(null)` deep-equals `{ lang: 'en', completed: [] }`.
  - `parse('not json')`, `parse('42')`, `parse('{"lang":"fr","completed":"x"}')` all deep-equal the default.
  - `parse('{"lang":"vi","completed":["tools",7,"tools"]}')` deep-equals `{ lang: 'vi', completed: ['tools'] }` (non-strings and duplicates dropped).
  - `countDone([{id:'a'},{id:'b'}], ['a','a','gone'])` equals `1`.
  - `load()` and `save({})` do not throw when `globalThis.localStorage` is undefined.

- [ ] **Step 2: Run `npm test`.** Expected: FAIL, module not found.
- [ ] **Step 3: Implement the four functions.** `load` and `save` wrap storage access in try/catch.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** as `Add saved progress`.

### Task 3: Hash routing

**Files:**
- Create: `src/route.js`
- Test: `src/route.test.js`

**Interfaces:**
- Produces: `parseHash(hash: string): { screen: 'home' } | { screen: 'level', id: string } | { screen: 'lesson', id: string }`

- [ ] **Step 1: Write the failing tests:**
  - `''`, `'#'`, `'#/'`, `'#/nope'`, `'#/level/'`, `'#/lesson/a/b'` give `{ screen: 'home' }`.
  - `'#/level/beginner'` gives `{ screen: 'level', id: 'beginner' }`.
  - `'#/lesson/agent-loop'` gives `{ screen: 'lesson', id: 'agent-loop' }`.

- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `parseHash`.** It does not know which ids exist; Task 5 handles unknown ids.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** as `Add hash routing`.

### Task 4: Quiz component

**Files:**
- Create: `src/Quiz.jsx`

**Interfaces:**
- Consumes: a lesson's `quiz` array and `ui` from Task 1.
- Produces: `export const PASS_MARK = 3` and
  `export default function Quiz({ questions, ui, onPass, children })`.
  `onPass()` is called once when a finished attempt scores `PASS_MARK` or
  more. `children` is rendered under the result (the caller's next-lesson links).

- [ ] **Step 1: Implement `Quiz`.** State is one array of chosen option
  indices, one slot per question. All four questions are shown at once, each
  labelled with `ui.question(n, total)`. Options are `<button>` elements;
  choosing one disables that question's buttons, marks the chosen and the
  correct option with an icon plus `ui.correct` / `ui.incorrect`, and shows
  the explanation in an `aria-live="polite"` region. When every question is
  answered, show `ui.score(n, total)` with `ui.passed` or `ui.failed`; on a
  fail show a `ui.retry` button that clears the answers.
- [ ] **Step 2: Run `npm run build`.** Expected: build succeeds.
- [ ] **Step 3: Commit** as `Add quiz component`.

### Task 5: Screens, styling and end-to-end check

**Files:**
- Create: `src/App.jsx`, `src/styles.css`
- Modify: `src/main.jsx` (render `App`, import `styles.css`), `index.html` (title, viewport, no template favicon)

**Interfaces:**
- Consumes: content files (Task 1); `load`, `save`, `countDone` (Task 2); `parseHash` (Task 3); `Quiz` (Task 4).

- [ ] **Step 1: Implement `App`.** State: `lang`, `completed` (initialised
  from `load()`, saved on change) and the current route (from `parseHash`,
  updated on `hashchange`). Set `document.documentElement.lang` to `lang`.
  Header: app name linking to `#/`, and a button that switches to the other
  language, labelled with that language's `ui.langName`. Screens per the
  spec: Home (level cards with `<progress>` and `ui.progress`), Level (ordered
  lesson list with a tick and `ui.completed` on finished lessons), Lesson
  (title, sections, then `Quiz`). A level or lesson id not found in the
  content renders Home. `Quiz` gets `key={lesson.id}` so each lesson starts
  fresh while a language switch keeps answers. `onPass` adds the lesson id to
  `completed`. Under the quiz result: a link to the next lesson in the same
  level if there is one, and a link back to the level. Scroll to top on route change.
- [ ] **Step 2: Write `src/styles.css`.** Colour tokens on `:root` with a
  `prefers-color-scheme: dark` override; single-column layout capped near
  70ch; level cards in a grid that collapses to one column on phones; visible
  `:focus-visible` ring; correct and incorrect states distinguishable without colour.
- [ ] **Step 3: Run `npm test` and `npm run build`.** Expected: all tests PASS, build succeeds.
- [ ] **Step 4: Check in a browser** with `npm run dev`:
  - Home shows three levels at 0 of 4.
  - Pass a Beginner quiz: the lesson gets a tick, Home shows 1 of 4, and it survives a reload.
  - Fail a quiz: not marked complete, Retry clears it.
  - Switch language mid-quiz: text changes, given answers stay, choice survives a reload.
  - Next-lesson link shows a fresh quiz.
  - `#/lesson/nope` and `#/level/nope` show Home.
  - Tab and Enter alone can complete a quiz.
  - Phone width has no horizontal scroll.
  - No console errors.
- [ ] **Step 5: Commit** as `Add screens and styling`.
