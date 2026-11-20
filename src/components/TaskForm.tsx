import { useState } from 'react'
import type { FormEvent } from 'react'
import type { NewTask, Priority, Task } from '../types/task'
import './TaskForm.scss'

const DEFAULT_CATEGORY = 'General'

const emptyForm: NewTask = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
}

function getInitialValues(task: Task | null): NewTask {
  if (!task) {
    return emptyForm
  }
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
  }
}

interface TaskFormProps {
  // Завдання, яке редагується (null: форма створює нове)
  editingTask: Task | null
  // Виконує запит через repository. Повертає true, якщо операція вдалася
  onSubmit: (data: NewTask) => Promise<boolean>
  onCancel: () => void
}

function TaskForm({ editingTask, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = editingTask !== null
  const [values, setValues] = useState<NewTask>(() => getInitialValues(editingTask))
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Inline success state після створення
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')

    const title = values.title.trim()
    if (title === '') {
      setError('Вкажіть назву завдання.')
      return
    }
    setError('')

    setIsSubmitting(true)
    const ok = await onSubmit({
      title,
      description: values.description.trim(),
      category: values.category.trim() || DEFAULT_CATEGORY,
      priority: values.priority,
    })
    setIsSubmitting(false)

    // Форма очищується лише після успішного створення
    if (ok && !isEditing) {
      setValues(emptyForm)
      setSuccessMessage('Завдання додано.')
    }
  }

  const titleClassName = error
    ? 'task-form__input task-form__input--invalid'
    : 'task-form__input'

  return (
    <form
      className={isEditing ? 'task-form task-form--editing' : 'task-form'}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="task-form__title">{isEditing ? 'Редагування завдання' : 'Нове завдання'}</h2>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          Назва
        </label>
        <input
          id="task-title"
          className={titleClassName}
          type="text"
          value={values.title}
          placeholder="Наприклад, Rendering Lists"
          aria-invalid={error !== ''}
          aria-describedby={error ? 'task-title-error' : undefined}
          onChange={(event) => {
            setValues({ ...values, title: event.target.value })
            if (error) {
              setError('')
            }
          }}
        />
        {error && (
          <p id="task-title-error" className="task-form__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-description">
          Опис
        </label>
        <input
          id="task-description"
          className="task-form__input"
          type="text"
          value={values.description}
          placeholder="Короткий опис"
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-category">
            Категорія
          </label>
          <input
            id="task-category"
            className="task-form__input"
            type="text"
            value={values.category}
            placeholder={DEFAULT_CATEGORY}
            onChange={(event) => setValues({ ...values, category: event.target.value })}
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
            className="task-form__input"
            value={values.priority}
            onChange={(event) =>
              setValues({ ...values, priority: event.target.value as Priority })
            }
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <div className="task-form__actions">
        <button className="task-form__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Збереження...' : isEditing ? 'Зберегти' : 'Додати'}
        </button>
        {isEditing && (
          <button
            className="task-form__cancel"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Скасувати
          </button>
        )}
      </div>

      {successMessage && (
        <p className="task-form__success" role="status">
          {successMessage}
        </p>
      )}
    </form>
  )
}

export default TaskForm
