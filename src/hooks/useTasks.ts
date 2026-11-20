import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '../api/httpClient'
import { taskRepository } from '../repositories/taskRepository'
import type { NewTask, Task, TaskChanges } from '../types/task'
import { getErrorMessage } from '../utils/errors'
import { useToast } from './useToast'

export const PAGE_SIZE = 10

export type ListStatus = 'loading' | 'success' | 'error'

interface LoadedList {
  // Для яких параметрів (сторінка, пошук) отримано ці дані
  key: string
  tasks: Task[]
  total: number
  error: string | null
}

function makeKey(page: number, query: string, reloadToken: number): string {
  return `${page}|${query}|${reloadToken}`
}

// Server state: список завдань із REST API (через repository).
// Стан (loading/success/error) обчислюється, а не зберігається окремо:
// якщо дані отримано не для поточних параметрів, значить, запит ще виконується.
export function useTasks(page: number, query: string) {
  const [loaded, setLoaded] = useState<LoadedList | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [busyIds, setBusyIds] = useState<number[]>([])
  const { showToast } = useToast()
  const key = makeKey(page, query, reloadToken)

  useEffect(() => {
    // Скасування: якщо параметри змінилися, а попередній запит ще виконується, він переривається
    const controller = new AbortController()
    const requestKey = makeKey(page, query, reloadToken)

    taskRepository
      .getAll({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, query, signal: controller.signal })
      .then((result) => {
        setLoaded({ key: requestKey, tasks: result.tasks, total: result.total, error: null })
      })
      .catch((error: unknown) => {
        // Скасований запит не показуємо як помилку завантаження
        if (isAbortError(error)) {
          return
        }
        setLoaded({ key: requestKey, tasks: [], total: 0, error: getErrorMessage(error) })
      })

    return () => controller.abort()
  }, [page, query, reloadToken])

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  // Mutation: POST через repository. Після успіху список оновлюється без перезавантаження сторінки
  const create = useCallback(
    async (data: NewTask): Promise<boolean> => {
      try {
        const task = await taskRepository.create(data)
        showToast('success', `Завдання "${task.title}" створено.`)
        reload()
        return true
      } catch (error) {
        showToast('error', `Не вдалося створити завдання. ${getErrorMessage(error)}`)
        return false
      }
    },
    [reload, showToast],
  )

  // Mutation: PATCH через repository. Оновлений елемент підставляється в поточний список
  const update = useCallback(
    async (id: number, changes: TaskChanges, successMessage?: string): Promise<boolean> => {
      setBusyIds((ids) => [...ids, id])
      try {
        const updated = await taskRepository.update(id, changes)
        setLoaded((prev) =>
          prev ? { ...prev, tasks: prev.tasks.map((task) => (task.id === id ? updated : task)) } : prev,
        )
        if (successMessage) {
          showToast('success', successMessage)
        }
        return true
      } catch (error) {
        showToast('error', `Не вдалося оновити завдання. ${getErrorMessage(error)}`)
        return false
      } finally {
        setBusyIds((ids) => ids.filter((busyId) => busyId !== id))
      }
    },
    [showToast],
  )

  const toggle = useCallback(
    (task: Task) => update(task.id, { completed: !task.completed }),
    [update],
  )

  // Mutation: DELETE через repository
  const remove = useCallback(
    async (task: Task): Promise<boolean> => {
      try {
        await taskRepository.delete(task.id)
        showToast('success', `Завдання "${task.title}" видалено.`)
        reload()
        return true
      } catch (error) {
        showToast('error', `Не вдалося видалити завдання. ${getErrorMessage(error)}`)
        return false
      }
    },
    [reload, showToast],
  )

  let status: ListStatus = 'loading'
  if (loaded !== null && loaded.key === key) {
    status = loaded.error === null ? 'success' : 'error'
  }

  return {
    status,
    tasks: status === 'success' && loaded ? loaded.tasks : [],
    // Останнє відоме значення total зберігається, поки вантажиться інша сторінка
    total: loaded && loaded.error === null ? loaded.total : 0,
    error: status === 'error' && loaded ? loaded.error : null,
    reload,
    busyIds,
    create,
    update,
    toggle,
    remove,
  }
}
