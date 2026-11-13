import type { Priority, Task, TaskFilter } from '../types/task'

const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const FILTERS: TaskFilter[] = ['all', 'completed', 'active']

// Дані з localStorage можуть бути будь-якими, тому перевіряємо їхню форму перед використанням
export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.category === 'string' &&
    PRIORITIES.includes(task.priority as Priority)
  )
}

export function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask)
}

export function isTaskFilter(value: unknown): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter)
}
