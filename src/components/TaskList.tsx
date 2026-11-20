import type { Task } from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  tasks: Task[]
  // id завдань, для яких зараз виконується запит
  busyIds?: number[]
  onOpen?: (task: Task) => void
  onToggle?: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

function TaskList({ tasks, busyIds = [], onOpen, onToggle, onEdit, onDelete }: TaskListProps) {
  return (
    <ul className="task-list">
      {/* key: стабільний id завдання, а не індекс у масиві */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          busy={busyIds.includes(task.id)}
          onOpen={onOpen}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TaskList
