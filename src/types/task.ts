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
