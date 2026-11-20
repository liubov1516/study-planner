import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

interface TaskFiltersProps {
  filter: TaskFilter
  // Кількість завдань поточної сторінки для кожного фільтра
  counts: Record<TaskFilter, number>
  onFilterChange: (filter: TaskFilter) => void
}

// Фільтр - client/UI state: він лише ховає частину вже завантажених завдань сторінки
function TaskFilters({ filter, counts, onFilterChange }: TaskFiltersProps) {
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
    </div>
  )
}

export default TaskFilters
