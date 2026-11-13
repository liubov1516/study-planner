import { initialTasks } from '../data/initialTasks'
import type { NewTask, Task } from '../types/task'

// Завдання (або кілька), які очікують остаточного видалення, поки користувач може натиснути Undo
export interface PendingDelete {
  ids: number[]
  // Номер запиту: щоразу новий, тому за ним можна відрізнити нове видалення від попереднього
  requestId: number
}

export interface TaskState {
  tasks: Task[]
  pendingDelete: PendingDelete | null
  lastRequestId: number
}

export type TaskAction =
  | { type: 'add'; payload: NewTask }
  | { type: 'toggle'; id: number }
  | { type: 'update'; id: number; changes: NewTask }
  | { type: 'requestDelete'; id: number }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'clearCompleted' }
  | { type: 'reset' }

export function createInitialState(tasks: Task[]): TaskState {
  return { tasks, pendingDelete: null, lastRequestId: 0 }
}

function getNextId(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1
}

function isPending(state: TaskState, id: number): boolean {
  return state.pendingDelete?.ids.includes(id) ?? false
}

// Остаточно прибирає завдання, які очікували видалення
function applyPendingDelete(state: TaskState): Task[] {
  const pending = state.pendingDelete
  if (!pending) {
    return state.tasks
  }
  return state.tasks.filter((task) => !pending.ids.includes(task.id))
}

// Запускає Undoable Delete для вказаних завдань. Одночасно активне лише одне видалення:
// попереднє, якщо воно ще чекало, завершується одразу
function startPendingDelete(state: TaskState, ids: number[]): TaskState {
  const tasks = applyPendingDelete(state)
  const existingIds = ids.filter((id) => tasks.some((task) => task.id === id))
  if (existingIds.length === 0) {
    return state
  }
  const requestId = state.lastRequestId + 1
  return { tasks, pendingDelete: { ids: existingIds, requestId }, lastRequestId: requestId }
}

// Чиста функція: не звертається до DOM, localStorage, таймерів чи мережі
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        tasks: [{ ...action.payload, id: getNextId(state.tasks), completed: false }, ...state.tasks],
      }

    case 'toggle':
      if (isPending(state, action.id)) {
        return state
      }
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }

    case 'update':
      if (isPending(state, action.id)) {
        return state
      }
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, ...action.changes } : task,
        ),
      }

    case 'requestDelete':
      if (isPending(state, action.id)) {
        return state
      }
      return startPendingDelete(state, [action.id])

    case 'clearCompleted':
      return startPendingDelete(
        state,
        state.tasks.filter((task) => task.completed).map((task) => task.id),
      )

    case 'confirmDelete':
      return { ...state, tasks: applyPendingDelete(state), pendingDelete: null }

    case 'undoDelete':
      return { ...state, pendingDelete: null }

    case 'reset':
      return { ...state, tasks: initialTasks, pendingDelete: null }
  }
}
