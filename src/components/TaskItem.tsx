import type { Priority, Task } from '../types/task'
import './TaskItem.scss'

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const className = task.completed ? 'task-item task-item--completed' : 'task-item'

  return (
    <li className={className}>
      <div className="task-item__header">
        {/* Умовний рендеринг:позначка показується лише для виконаного завдання */}
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
        <button
          className="task-item__button task-item__button--toggle"
          type="button"
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Повернути в роботу' : 'Позначити виконаним'}
        </button>
        <button
          className="task-item__button task-item__button--delete"
          type="button"
          onClick={() => onDelete(task.id)}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
