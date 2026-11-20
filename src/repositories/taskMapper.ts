import type { ApiTodo } from '../types/api'
import type { Task } from '../types/task'

// DummyJSON не зберігає опис, пріоритет і категорію, тому для завдань із сервера
// вони є client-only metadata зі значеннями за замовчуванням
export const DEFAULT_USER_ID = 5

export function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'General',
  }
}
