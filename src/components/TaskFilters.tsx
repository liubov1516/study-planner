import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

interface TaskFiltersProps {
  filter: TaskFilter
  // Кількість завдань для кожного фільтра (показується в кнопках)
  counts: Record<TaskFilter, number>
  onFilterChange: (filter: TaskFilter) => void
  onClearCompleted: () => void
}

function TaskFilters({ filter, counts, onFilterChange, onClearCompleted }: TaskFiltersProps) {
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
          onClick={() => onFilterChange(value)}
        >
          {label} ({counts[value]})
        </button>
      ))}
      {/* Кнопка очищення з'являється, лише коли є що очищати */}
      {counts.completed > 0 && (
        <button
          className="task-filters__button task-filters__button--clear"
          type="button"
          onClick={onClearCompleted}
        >
          Очистити виконані
        </button>
      )}
    </div>
  )
}

export default TaskFilters
