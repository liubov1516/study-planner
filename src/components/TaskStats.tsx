import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

function TaskStats() {
  const { tasks } = useTaskContext()

  // Derived state: лічильники обчислюються під час рендеру, без useEffect і окремого state
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const active = total - completed

  return (
    <ul className="task-stats" aria-label="Статистика завдань">
      <li className="task-stats__item">
        <span className="task-stats__value">{total}</span>
        <span className="task-stats__label">Усього</span>
      </li>
      <li className="task-stats__item task-stats__item--completed">
        <span className="task-stats__value">{completed}</span>
        <span className="task-stats__label">Виконано</span>
      </li>
      <li className="task-stats__item task-stats__item--active">
        <span className="task-stats__value">{active}</span>
        <span className="task-stats__label">Не виконано</span>
      </li>
    </ul>
  )
}

export default TaskStats
