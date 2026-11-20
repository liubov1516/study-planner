export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

// Дані, які користувач вводить у формі: id і completed додає застосунок
export type NewTask = Omit<Task, 'id' | 'completed'>

export type TaskFilter = 'all' | 'completed' | 'active'

// Часткова зміна завдання (будь-яке поле, крім id)
export type TaskChanges = Partial<Omit<Task, 'id'>>

export interface TaskPage {
  tasks: Task[]
  // Скільки завдань усього (для розрахунку кількості сторінок)
  total: number
}

export interface TaskListParams {
  limit: number
  skip: number
  // Пошук за назвою (на сервері)
  query?: string
  signal?: AbortSignal
}
