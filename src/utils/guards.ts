import type { TaskFilter } from '../types/task'

const FILTERS: TaskFilter[] = ['all', 'completed', 'active']

// Дані з localStorage можуть бути будь-якими, тому перевіряємо їхню форму перед використанням
export function isTaskFilter(value: unknown): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter)
}
