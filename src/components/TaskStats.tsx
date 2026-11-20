import type { Task } from '../types/task'
import './TaskStats.scss'

interface TaskStatsProps {
  // Скільки завдань є на сервері (з відповіді API)
  total: number
  // Завдання поточної сторінки
  tasks: Task[]
}

function TaskStats({ total, tasks }: TaskStatsProps) {
  // Derived state: лічильники сторінки обчислюються під час рендеру
  const completed = tasks.filter((task) => task.completed).length
  const active = tasks.length - completed

  return (
    <ul className="task-stats" aria-label="Статистика завдань">
      <li className="task-stats__item">
        <span className="task-stats__value">{total}</span>
        <span className="task-stats__label">Усього завдань</span>
      </li>
      <li className="task-stats__item task-stats__item--completed">
        <span className="task-stats__value">{completed}</span>
        <span className="task-stats__label">Виконано на сторінці</span>
      </li>
      <li className="task-stats__item task-stats__item--active">
        <span className="task-stats__value">{active}</span>
        <span className="task-stats__label">Не виконано на сторінці</span>
      </li>
    </ul>
  )
}

export default TaskStats
