import { useTaskContext } from '../hooks/useTaskContext'
import TaskItem from './TaskItem'
import './TaskList.scss'

function TaskList() {
  const { tasks, filter, query } = useTaskContext()

  // Список для екрана - derived state: обчислюється під час рендеру, масив tasks не змінюється
  const normalizedQuery = query.trim().toLowerCase()
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed' && !task.completed) {
      return false
    }
    if (filter === 'active' && task.completed) {
      return false
    }
    return task.title.toLowerCase().includes(normalizedQuery)
  })

  // Умовний рендеринг: два різні повідомлення для порожнього стану
  if (visibleTasks.length === 0) {
    return tasks.length === 0 ? (
      <div className="task-list__empty">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p className="task-list__empty-hint">Додайте перше навчальне завдання.</p>
      </div>
    ) : (
      <div className="task-list__empty">
        <p className="task-list__empty-title">За цим фільтром завдань немає.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {/* key: стабільний id завдання, а не індекс у масиві */}
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
