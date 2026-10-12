# AI learning app: design

Date: 2026-10-12

## Goal

A web app that teaches the general public about AI and AI agents. A learner
picks a level, reads short lessons, and checks their understanding with a quiz
after each lesson. Success means someone with no background can finish the
Beginner level and explain what AI and a chatbot are, and someone who finishes
Advanced can explain how an agent plans, uses tools and remembers.

## Constraints

- Three levels: Beginner, Intermediate, Advanced. All open, none locked.
- English and Vietnamese, switched from any screen. The choice is remembered.
- No backend, no accounts, no API key. Progress lives in `localStorage`.
- React + Vite. No router library, no UI library, no state library.

## Curriculum

Twelve lessons, four per level. Each lesson has a title, a one-line summary,
three to five short sections of reading, and a four-question multiple-choice
quiz. Every question has four options, one correct answer and a one-line
explanation shown after answering.

| Level | Lesson id | Topic |
|---|---|---|
| Beginner | `what-is-ai` | What AI is |
| Beginner | `machine-learning` | How machines learn from data |
| Beginner | `chatbots-llms` | What a chatbot / LLM is |
| Beginner | `can-and-cannot` | What AI can and cannot do |
| Intermediate | `how-llms-work` | Tokens, prediction, context window |
| Intermediate | `prompting` | Prompting well |
| Intermediate | `hallucinations` | Hallucinations and why they happen |
| Intermediate | `what-is-an-agent` | What an AI agent is |
| Advanced | `agent-loop` | The agent loop: think, act, observe |
| Advanced | `tools` | Tools and function calling |
| Advanced | `memory-rag` | Memory and retrieval (RAG) |
| Advanced | `multi-agent-safety` | Multi-agent systems, safety and limits |

## Screens

Routing uses the URL hash so the back button and deep links work.

1. **Home** (`#/`): three level cards, each with a description and a progress
   bar (completed lessons out of four).
2. **Level** (`#/level/<levelId>`): the level's lessons in order, with a tick
   on completed ones.
3. **Lesson** (`#/lesson/<lessonId>`): the reading, then the quiz. Picking an
   option locks the question and shows right or wrong plus the explanation.
   After the last question the score is shown. Three or more correct marks the
   lesson complete; otherwise the learner can retry. A link leads to the next
   lesson.

A header on every screen holds the app name (links home) and the language
switch. An unknown hash falls back to Home.

## Structure

- `src/content/en.js`, `src/content/vi.js`: each exports the same shape:
  `{ ui: {...strings}, levels: [{ id, title, description, lessons: [{ id,
  title, summary, sections: [{ heading, body }], quiz: [{ question, options,
  answer, explanation }] }] }] }`. `answer` is the index of the correct option.
- `src/progress.js`: `load()` and `save(state)` for
  `{ lang, completed: [lessonId] }`. Read and write are wrapped in try/catch
  so the app still works when storage is unavailable.
- `src/App.jsx`: header, hash routing and the three screens.
- `src/Quiz.jsx`: the quiz, its own component because it holds its own state.
- `src/styles.css`: one stylesheet, responsive, light and dark.

## Accessibility

Quiz options are real `<button>` elements, reachable by keyboard, with a
visible focus ring. Right and wrong are shown with text and an icon, not
colour alone. The `<html lang>` attribute follows the chosen language.

## Check

`src/content/content.test.js`, run with `node --test`, fails if:

- the two language files have different level ids, lesson ids or question
  counts;
- any quiz does not have four questions with four options each;
- any `answer` index is out of range;
- the two languages disagree on a question's `answer` index.

## Out of scope

Interactive demos, an AI tutor, accounts, syncing progress across devices,
certificates, search.
