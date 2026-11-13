import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

function TaskFilters() {
  const { tasks, filter, setFilter, clearCompleted, resetTasks } = useTaskContext()

  // Кількість завдань для кожного фільтра (derived state)
  const completedCount = tasks.filter((task) => task.completed).length
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: completedCount,
    active: tasks.length - completedCount,
  }

  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          className={
            value === filter
              ? 'task-filters__button task-filters__button--active'
              : 'task-filters__button'
          }
          type="button"
          aria-pressed={value === filter}
          onClick={() => setFilter(value)}
        >
          {label} ({counts[value]})
        </button>
      ))}
      {/* Кнопка очищення з'являється, лише коли є що очищати */}
      {counts.completed > 0 && (
        <button
          className="task-filters__button task-filters__button--clear"
          type="button"
          onClick={clearCompleted}
        >
          Очистити виконані
        </button>
      )}
      <button
        className="task-filters__button task-filters__button--reset"
        type="button"
        onClick={resetTasks}
      >
        Скинути дані
      </button>
    </div>
  )
}

export default TaskFilters
