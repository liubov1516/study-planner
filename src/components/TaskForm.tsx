import { useState } from 'react'
import type { FormEvent } from 'react'
import type { NewTask, Priority } from '../types/task'
import './TaskForm.scss'

const DEFAULT_CATEGORY = 'Загальне'

interface TaskFormProps {
  onAddTask: (task: NewTask) => void
}

const emptyForm: NewTask = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
}

function TaskForm({ onAddTask }: TaskFormProps) {
  // Одне поле стану для всієї форми: оновлюємо його новим об'єктом, а не змінюємо наявний
  const [values, setValues] = useState<NewTask>(emptyForm)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = values.title.trim()
    if (title === '') {
      setError('Вкажіть назву завдання.')
      return
    }

    onAddTask({
      title,
      description: values.description.trim(),
      category: values.category.trim() || DEFAULT_CATEGORY,
      priority: values.priority,
    })
    // Після успішного додавання форма очищується
    setValues(emptyForm)
    setError('')
  }

  const titleClassName = error
    ? 'task-form__input task-form__input--invalid'
    : 'task-form__input'

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">Нове завдання</h2>

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
        {/* Повідомлення про помилку виводиться на сторінці, а не через alert */}
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

      <button className="task-form__submit" type="submit">
        Додати
      </button>
    </form>
  )
}

export default TaskForm
