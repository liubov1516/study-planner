import { useState } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskSearch from './components/TaskSearch'
import TaskStats from './components/TaskStats'
import { initialTasks } from './data/initialTasks'
import type { NewTask, Task, TaskFilter } from './types/task'
import './App.scss'

function getNextId(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [query, setQuery] = useState('')

  //Нове завдання додається на початок нового масиву (immutable update)
  function handleAddTask(newTask: NewTask) {
    setTasks((prev) => [{ ...newTask, id: getNextId(prev), completed: false }, ...prev])
  }

  // Змінюється лише одне завдання: map повертає новий масив і новий об'єкт для цього завдання
  function handleToggleTask(id: number) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  function handleDeleteTask(id: number) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  function handleClearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: completedCount,
    active: tasks.length - completedCount,
  }

  // Список для екрана отримуємо з tasks під час рендеру, сам масив tasks при цьому не змінюється
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

  return (
    <div className="app">
      <Header />
      <TaskForm onAddTask={handleAddTask} />
      <TaskStats tasks={tasks} />
      <TaskSearch query={query} onQueryChange={setQuery} />
      <TaskFilters
        filter={filter}
        counts={counts}
        onFilterChange={setFilter}
        onClearCompleted={handleClearCompleted}
      />
      <TaskList
        tasks={visibleTasks}
        totalCount={tasks.length}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default App
