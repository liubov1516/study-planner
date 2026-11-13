import { createContext } from 'react'
import type { PendingDelete } from '../reducers/taskReducer'
import type { NewTask, Task, TaskFilter } from '../types/task'
import type { ToastMessage, ToastVariant } from '../types/toast'

// Усе, що компоненти можуть робити зі спільним станом. Деталі reducer-а
// (типи action, dispatch) компоненти не бачать
export interface TaskContextValue {
  tasks: Task[]
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  query: string
  setQuery: (query: string) => void
  // Видалення, яке ще можна скасувати (null, якщо такого немає)
  pendingDelete: PendingDelete | null
  // Завдання, яке зараз редагується (null, якщо форма працює в режимі створення)
  editingTask: Task | null
  startEdit: (id: number) => void
  cancelEdit: () => void
  // Поточне сповіщення (Toast)
  toast: ToastMessage | null
  showToast: (variant: ToastVariant, message: string) => void
  dismissToast: () => void
  addTask: (data: NewTask) => void
  updateTask: (id: number, data: NewTask) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: () => void
  clearCompleted: () => void
  resetTasks: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
