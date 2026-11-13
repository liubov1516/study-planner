import { useTaskContext } from '../hooks/useTaskContext'
import type { Priority, Task } from '../types/task'
import './TaskItem.scss'

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

interface TaskItemProps {
  task: Task
}

function TaskItem({ task }: TaskItemProps) {
  // Дії беремо з контексту, а не через props з батьківських компонентів
  const { pendingDelete, editingTask, startEdit, toggleTask, requestDelete } = useTaskContext()
  const isPendingDelete = pendingDelete?.ids.includes(task.id) ?? false
  const isEditing = editingTask?.id === task.id

  function handleEdit() {
    startEdit(task.id)
    // Форма знаходиться вгорі сторінки, тому прокручуємо до неї
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const className = [
    'task-item',
    task.completed && 'task-item--completed',
    isEditing && 'task-item--editing',
    isPendingDelete && 'task-item--pending',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={className}>
      <div className="task-item__header">
        {/* Умовний рендеринг: позначка показується лише для виконаного завдання */}
        {task.completed && (
          <span className="task-item__status" aria-label="Виконано">
            ✓
          </span>
        )}
        <h3 className="task-item__title">{task.title}</h3>
        {isPendingDelete && <span className="task-item__pending-label">Буде видалено</span>}
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
          disabled={isPendingDelete}
          onClick={() => toggleTask(task.id)}
        >
          {task.completed ? 'Повернути в роботу' : 'Позначити виконаним'}
        </button>
        <button
          className="task-item__button"
          type="button"
          disabled={isPendingDelete}
          onClick={handleEdit}
        >
          Редагувати
        </button>
        <button
          className="task-item__button task-item__button--delete"
          type="button"
          disabled={isPendingDelete}
          onClick={() => requestDelete(task.id)}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
