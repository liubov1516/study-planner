import { useTaskDetails } from '../hooks/useTaskDetails'
import type { Priority } from '../types/task'
import StatusMessage from './StatusMessage'
import './TaskDetails.scss'

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

interface TaskDetailsProps {
  taskId: number
  onClose: () => void
}

function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const { status, task, error, retry } = useTaskDetails(taskId)

  function renderContent() {
    if (status === 'loading') {
      return <StatusMessage variant="loading" title="Loading..." />
    }
    if (status === 'error' || task === null) {
      return (
        <StatusMessage
          variant="error"
          title="Помилка завантаження."
          message={error ?? undefined}
          onRetry={retry}
        />
      )
    }
    return (
      <>
        <dl className="task-details__list">
          <dt className="task-details__term">Назва</dt>
          <dd className="task-details__value">{task.title}</dd>
          <dt className="task-details__term">Опис</dt>
          <dd className="task-details__value">{task.description || '—'}</dd>
          <dt className="task-details__term">Категорія</dt>
          <dd className="task-details__value">{task.category}</dd>
          <dt className="task-details__term">Пріоритет</dt>
          <dd className="task-details__value">{PRIORITY_LABELS[task.priority]}</dd>
          <dt className="task-details__term">Стан</dt>
          <dd className="task-details__value">{task.completed ? 'Виконано' : 'Не виконано'}</dd>
        </dl>
        <p className="task-details__note">
          Опис, категорія та пріоритет не підтримуються DummyJSON: це client-only metadata.
        </p>
      </>
    )
  }

  return (
    <section className="task-details" aria-label="Деталі завдання">
      <div className="task-details__header">
        <h2 className="task-details__heading">Деталі завдання №{taskId}</h2>
        <button className="task-details__close" type="button" onClick={onClose}>
          Закрити
        </button>
      </div>
      {renderContent()}
    </section>
  )
}

export default TaskDetails
