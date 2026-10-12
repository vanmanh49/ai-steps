import assert from 'node:assert/strict'
import { test } from 'node:test'
import en from './en.js'
import vi from './vi.js'

const languages = { en, vi }

const EXPECTED_IDS = [
  'beginner/what-is-ai',
  'beginner/machine-learning',
  'beginner/chatbots-llms',
  'beginner/can-and-cannot',
  'intermediate/how-llms-work',
  'intermediate/prompting',
  'intermediate/hallucinations',
  'intermediate/what-is-an-agent',
  'advanced/agent-loop',
  'advanced/tools',
  'advanced/memory-rag',
  'advanced/multi-agent-safety',
]

const ids = (content) =>
  content.levels.flatMap((level) => level.lessons.map((lesson) => `${level.id}/${lesson.id}`))

const lessons = (content) => content.levels.flatMap((level) => level.lessons)

test('languages have the same level and lesson ids', () => {
  assert.deepEqual(ids(en), EXPECTED_IDS)
  assert.deepEqual(ids(vi), EXPECTED_IDS)
})

test('every lesson has 3 to 5 sections and 4 questions with 4 options', () => {
  for (const [lang, content] of Object.entries(languages)) {
    for (const lesson of lessons(content)) {
      const where = `${lang}/${lesson.id}`
      assert.ok(lesson.sections.length >= 3 && lesson.sections.length <= 5, `${where} sections`)
      assert.equal(lesson.quiz.length, 4, `${where} questions`)
      for (const q of lesson.quiz) assert.equal(q.options.length, 4, `${where} options`)
    }
  }
})

test('every answer index is 0 to 3 and matches across languages', () => {
  const answers = (content) => lessons(content).map((lesson) => lesson.quiz.map((q) => q.answer))
  for (const a of answers(en).flat()) assert.ok([0, 1, 2, 3].includes(a), `answer ${a}`)
  assert.deepEqual(answers(vi), answers(en))
})

test('ui has the same keys in both languages', () => {
  assert.deepEqual(Object.keys(vi.ui).sort(), Object.keys(en.ui).sort())
})

test('no empty text', () => {
  const filled = (value, where) =>
    assert.ok(typeof value === 'string' && value.trim() !== '', `empty text at ${where}`)
  for (const [lang, content] of Object.entries(languages)) {
    for (const level of content.levels) {
      filled(level.title, `${lang}/${level.id} title`)
      filled(level.description, `${lang}/${level.id} description`)
      for (const lesson of level.lessons) {
        const where = `${lang}/${lesson.id}`
        filled(lesson.title, where)
        filled(lesson.summary, where)
        for (const s of lesson.sections) {
          filled(s.heading, where)
          filled(s.body, where)
        }
        for (const q of lesson.quiz) {
          filled(q.question, where)
          filled(q.explanation, where)
          for (const option of q.options) filled(option, where)
        }
      }
    }
  }
})
