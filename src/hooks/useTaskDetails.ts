import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '../api/httpClient'
import { taskRepository } from '../repositories/taskRepository'
import type { Task } from '../types/task'
import { getErrorMessage } from '../utils/errors'
import type { ListStatus } from './useTasks'

interface LoadedTask {
  key: string
  task: Task | null
  error: string | null
}

function makeKey(id: number, reloadToken: number): string {
  return `${id}|${reloadToken}`
}

// Актуальні дані одного завдання (GET за id). Це локальний state компонента,
// у глобальний Context вони не потрапляють
export function useTaskDetails(id: number) {
  const [loaded, setLoaded] = useState<LoadedTask | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const key = makeKey(id, reloadToken)

  useEffect(() => {
    const controller = new AbortController()
    const requestKey = makeKey(id, reloadToken)

    taskRepository
      .getById(id, controller.signal)
      .then((task) => setLoaded({ key: requestKey, task, error: null }))
      .catch((error: unknown) => {
        // Користувач закрив деталі або вибрав інше завдання: це не помилка
        if (isAbortError(error)) {
          return
        }
        setLoaded({ key: requestKey, task: null, error: getErrorMessage(error) })
      })

    return () => controller.abort()
  }, [id, reloadToken])

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  let status: ListStatus = 'loading'
  if (loaded !== null && loaded.key === key) {
    status = loaded.error === null ? 'success' : 'error'
  }

  return {
    status,
    task: status === 'success' && loaded ? loaded.task : null,
    error: status === 'error' && loaded ? loaded.error : null,
    retry,
  }
}
