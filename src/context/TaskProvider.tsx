import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { UNDO_DELAY_MS } from '../data/constants'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { createInitialState, taskReducer } from '../reducers/taskReducer'
import type { NewTask, TaskFilter } from '../types/task'
import type { ToastMessage, ToastVariant } from '../types/toast'
import { isTaskArray, isTaskFilter } from '../utils/guards'
import { readStorage, writeStorage } from '../utils/storage'
import { TaskContext } from './TaskContext'
import type { TaskContextValue } from './TaskContext'

const TASKS_STORAGE_KEY = 'study-planner:tasks'
const FILTER_STORAGE_KEY = 'study-planner:filter'

// Початкові завдання: збережені, якщо вони є і не пошкоджені, інакше стартовий список
function loadInitialState() {
  return createInitialState(readStorage(TASKS_STORAGE_KEY, initialTasks, isTaskArray))
}

interface TaskProviderProps {
  children: ReactNode
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, null, loadInitialState)
  // Активний фільтр запам'ятовується між перезавантаженнями
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_STORAGE_KEY, 'all', isTaskFilter)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const toastCounter = useRef(0)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Derived state: редаговане завдання шукаємо в tasks, а не дублюємо в окремому state
  const editingTask = state.tasks.find((task) => task.id === editingId) ?? null

  const showToast = useCallback((variant: ToastVariant, message: string) => {
    toastCounter.current += 1
    setToast({ id: toastCounter.current, variant, message })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  // Заголовок вкладки: "Study Planner — 3 active tasks"
  const activeCount = state.tasks.filter((task) => !task.completed).length
  useDocumentTitle(`Study Planner — ${activeCount} active tasks`)

  // Таймер - побічний ефект, тому він живе тут, а не в reducer. Reducer лише змінює state.
  // Cleanup скасовує таймер, якщо користувач натиснув Undo, почалося нове видалення
  // або компонент розмонтовано
  const pendingDelete = state.pendingDelete
  useEffect(() => {
    if (!pendingDelete) {
      return
    }
    const count = pendingDelete.ids.length
    const timerId = setTimeout(() => {
      dispatch({ type: 'confirmDelete' })
      showToast('success', count === 1 ? 'Завдання остаточно видалено.' : `Видалено завдань: ${count}.`)
    }, UNDO_DELAY_MS)
    return () => clearTimeout(timerId)
  }, [pendingDelete, showToast])

  // Reducer лишається єдиним джерелом правди для tasks, а localStorage лише зберігає їх копію
  useEffect(() => {
    if (!writeStorage(TASKS_STORAGE_KEY, state.tasks)) {
      showToast('error', 'Не вдалося зберегти дані в браузері.')
    }
  }, [state.tasks, showToast])

  // dispatch стабільний, тому useCallback з порожніми залежностями створює функції один раз
  const addTask = useCallback(
    (data: NewTask) => {
      dispatch({ type: 'add', payload: data })
      showToast('success', `Завдання "${data.title}" створено.`)
    },
    [showToast],
  )

  const startEdit = useCallback((id: number) => {
    setEditingId(id)
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  const updateTask = useCallback(
    (id: number, data: NewTask) => {
      // Неможливість виконати дію теж повідомляємо користувачу
      if (!state.tasks.some((task) => task.id === id)) {
        showToast('error', 'Не вдалося зберегти: завдання не знайдено.')
        setEditingId(null)
        return
      }
      dispatch({ type: 'update', id, changes: data })
      setEditingId(null)
      showToast('success', `Завдання "${data.title}" оновлено.`)
    },
    [state.tasks, showToast],
  )

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', id })
  }, [])

  // Видалення не остаточне: завдання лише помічається, а таймер працює в useEffect нижче
  const requestDelete = useCallback((id: number) => {
    // Якщо видаляється завдання, яке редагується, режим редагування закривається
    setEditingId((current) => (current === id ? null : current))
    dispatch({ type: 'requestDelete', id })
  }, [])

  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' })
    showToast('info', 'Видалення скасовано.')
  }, [showToast])

  const clearCompleted = useCallback(() => {
    if (!state.tasks.some((task) => task.completed)) {
      showToast('info', 'Немає виконаних завдань для очищення.')
      return
    }
    // Масове видалення теж проходить через Undo
    dispatch({ type: 'clearCompleted' })
  }, [state.tasks, showToast])

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset' })
    setFilter('all')
    setQuery('')
    setEditingId(null)
    showToast('success', 'Дані скинуто до початкових.')
  }, [setFilter, showToast])

  // useMemo: об'єкт context створюється заново лише коли змінилися дані, а не при кожному рендері
  const value = useMemo<TaskContextValue>(
    () => ({
      tasks: state.tasks,
      filter,
      setFilter,
      query,
      setQuery,
      toast,
      showToast,
      dismissToast,
      pendingDelete,
      editingTask,
      startEdit,
      cancelEdit,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
    }),
    [
      state.tasks,
      filter,
      setFilter,
      query,
      toast,
      showToast,
      dismissToast,
      pendingDelete,
      editingTask,
      startEdit,
      cancelEdit,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
    ],
  )

  return <TaskContext value={value}>{children}</TaskContext>
}
