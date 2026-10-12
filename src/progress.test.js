import assert from 'node:assert/strict'
import { test } from 'node:test'
import { countDone, load, parse, save } from './progress.js'

const DEFAULT = { lang: 'en', completed: [] }

test('parse returns defaults when nothing is stored', () => {
  assert.deepEqual(parse(null), DEFAULT)
})

test('parse returns defaults for corrupt or wrongly shaped values', () => {
  assert.deepEqual(parse('not json'), DEFAULT)
  assert.deepEqual(parse('42'), DEFAULT)
  assert.deepEqual(parse('null'), DEFAULT)
  assert.deepEqual(parse('{"lang":"fr","completed":"x"}'), DEFAULT)
})

test('parse keeps a valid language and drops non-string and duplicate ids', () => {
  assert.deepEqual(parse('{"lang":"vi","completed":["tools",7,"tools"]}'), {
    lang: 'vi',
    completed: ['tools'],
  })
})

test('countDone counts each of the given lessons at most once', () => {
  assert.equal(countDone([{ id: 'a' }, { id: 'b' }], ['a', 'a', 'gone']), 1)
})

test('load and save do not throw when storage is unavailable', () => {
  assert.equal(globalThis.localStorage, undefined)
  assert.deepEqual(load(), DEFAULT)
  assert.doesNotThrow(() => save(DEFAULT))
})
