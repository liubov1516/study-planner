import type { Task } from '../types/task'

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'JSX and Props',
    description: 'Прочитати розділи про JSX та передачу props',
    completed: false,
    priority: 'medium',
    category: 'React',
  },
  {
    id: 4,
    title: 'Sass and BEM',
    description: 'Повторити правила іменування класів за BEM',
    completed: false,
    priority: 'low',
    category: 'CSS',
  },
]
