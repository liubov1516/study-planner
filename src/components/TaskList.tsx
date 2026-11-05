import type { Task } from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  // Завдання, які треба показати зараз (після фільтрації)
  tasks: Task[]
  // Скільки завдань усього: потрібно, щоб відрізнити порожній список від порожнього результату фільтра
  totalCount: number
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskList({ tasks, totalCount, onToggle, onDelete }: TaskListProps) {
  //Умовний рендеринг: два різні повідомлення для порожнього стану
  if (tasks.length === 0) {
    return totalCount === 0 ? (
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
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
