import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseHash } from './route.js'

test('empty, unknown and malformed hashes go home', () => {
  for (const hash of ['', '#', '#/', '#/nope', '#/level/', '#/lesson/a/b']) {
    assert.deepEqual(parseHash(hash), { screen: 'home' }, hash)
  }
})

test('level hash gives the level id', () => {
  assert.deepEqual(parseHash('#/level/beginner'), { screen: 'level', id: 'beginner' })
})

test('lesson hash gives the lesson id', () => {
  assert.deepEqual(parseHash('#/lesson/agent-loop'), { screen: 'lesson', id: 'agent-loop' })
})
