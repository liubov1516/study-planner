import type { Priority, Task } from '../types/task'
import './TaskItem.scss'

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

interface TaskItemProps {
  task: Task
  // Поки для завдання виконується запит, кнопки вимкнені
  busy?: boolean
  // Кнопка показується, лише якщо передано відповідний callback
  onOpen?: (task: Task) => void
  onToggle?: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

function TaskItem({ task, busy = false, onOpen, onToggle, onEdit, onDelete }: TaskItemProps) {
  const className = task.completed ? 'task-item task-item--completed' : 'task-item'

  return (
    <li className={className}>
      <div className="task-item__header">
        {task.completed && (
          <span className="task-item__status" aria-label="Виконано">
            ✓
          </span>
        )}
        <h3 className="task-item__title">{task.title}</h3>
      </div>

      {task.description && <p className="task-item__description">{task.description}</p>}

      <div className="task-item__meta">
        <span className="task-item__badge">{task.category}</span>
        <span className={`task-item__badge task-item__badge--${task.priority}`}>
          {PRIORITY_LABELS[task.priority]} пріоритет
        </span>
        <span className="task-item__badge">{task.completed ? 'Виконано' : 'Не виконано'}</span>
      </div>

      <div className="task-item__actions">
        {onOpen && (
          <button className="task-item__button" type="button" onClick={() => onOpen(task)}>
            Деталі
          </button>
        )}
        {onToggle && (
          <button
            className="task-item__button task-item__button--toggle"
            type="button"
            disabled={busy}
            onClick={() => onToggle(task)}
          >
            {task.completed ? 'Повернути в роботу' : 'Позначити виконаним'}
          </button>
        )}
        {onEdit && (
          <button
            className="task-item__button"
            type="button"
            disabled={busy}
            onClick={() => onEdit(task)}
          >
            Редагувати
          </button>
        )}
        {onDelete && (
          <button
            className="task-item__button task-item__button--delete"
            type="button"
            disabled={busy}
            onClick={() => onDelete(task)}
          >
            Видалити
          </button>
        )}
      </div>
    </li>
  )
}

export default TaskItem
