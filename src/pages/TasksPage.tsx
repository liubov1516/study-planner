import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Pagination from '../components/Pagination'
import StatusMessage from '../components/StatusMessage'
import TaskDetails from '../components/TaskDetails'
import TaskFilters from '../components/TaskFilters'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import TaskSearch from '../components/TaskSearch'
import TaskStats from '../components/TaskStats'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PAGE_SIZE, useTasks } from '../hooks/useTasks'
import type { NewTask, Task, TaskFilter } from '../types/task'
import { isTaskFilter } from '../utils/guards'
import './TasksPage.scss'

const FILTER_STORAGE_KEY = 'study-planner:filter'
const SEARCH_DELAY_MS = 400

function TasksPage() {
  // Client/UI state: поточна сторінка і фільтр (фільтр запам'ятовується між сеансами)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [search, setSearch] = useState('')
  // На сервер йде значення із затримкою (debounce), а не кожна літера
  const query = useDebouncedValue(search.trim(), SEARCH_DELAY_MS)
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_STORAGE_KEY, 'all', isTaskFilter)

  // Server state: дані з API
  const { status, tasks, total, error, reload, busyIds, create, update, toggle, remove } =
    useTasks(page, query)

  // Редаговане завдання шукаємо у списку, а не копіюємо в окремий state
  const editingTask = tasks.find((task) => task.id === editingId) ?? null

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  useDocumentTitle(`Study Planner — сторінка ${page}`)

  // Derived state: усе обчислюється під час рендеру з tasks
  const completedCount = tasks.filter((task) => task.completed).length
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: completedCount,
    active: tasks.length - completedCount,
  }
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed
    }
    if (filter === 'active') {
      return !task.completed
    }
    return true
  })

  // Одна форма для створення і редагування
  async function handleSubmit(data: NewTask): Promise<boolean> {
    if (editingTask) {
      const ok = await update(editingTask.id, data, `Завдання "${data.title}" оновлено.`)
      if (ok) {
        setEditingId(null)
      }
      return ok
    }
    const ok = await create(data)
    if (ok) {
      // Нове завдання показується на початку першої сторінки без пошуку
      setPage(1)
      setSearch('')
    }
    return ok
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    // Новий пошук завжди починається з першої сторінки
    setPage(1)
  }

  function handleEdit(task: Task) {
    setEditingId(task.id)
    // Форма знаходиться вгорі сторінки
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) {
      return
    }
    setIsDeleting(true)
    const ok = await remove(taskToDelete)
    setIsDeleting(false)
    if (ok) {
      if (editingId === taskToDelete.id) {
        setEditingId(null)
      }
      // Якщо видалено останнє завдання на сторінці, повертаємось на попередню
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1)
      }
    }
    setTaskToDelete(null)
  }

  function renderList() {
    if (status === 'loading') {
      return <StatusMessage variant="loading" title="Loading..." />
    }
    if (status === 'error') {
      return (
        <StatusMessage
          variant="error"
          title="Помилка завантаження."
          message={error ?? undefined}
          onRetry={reload}
        />
      )
    }
    if (tasks.length === 0) {
      return (
        <StatusMessage
          variant="empty"
          title="Завдань не знайдено."
          message={query ? `За запитом "${query}" нічого немає.` : undefined}
        />
      )
    }
    if (visibleTasks.length === 0) {
      return <StatusMessage variant="empty" title="За цим фільтром на цій сторінці завдань немає." />
    }
    return (
      <TaskList
        tasks={visibleTasks}
        busyIds={busyIds}
        onOpen={(task) => setSelectedId(task.id)}
        onToggle={toggle}
        onEdit={handleEdit}
        onDelete={setTaskToDelete}
      />
    )
  }

  return (
    <section className="tasks-page">
      {/* key: для іншого завдання деталі завантажуються з нуля */}
      {selectedId !== null && (
        <TaskDetails key={selectedId} taskId={selectedId} onClose={() => setSelectedId(null)} />
      )}
      {/* key: при переході між створенням і редагуванням форма починає з нуля */}
      <TaskForm
        key={editingTask?.id ?? 'new'}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingId(null)}
      />
      <TaskStats total={total} tasks={tasks} />
      <TaskSearch value={search} onChange={handleSearchChange} />
      <TaskFilters filter={filter} counts={counts} onFilterChange={setFilter} />
      <div className="tasks-page__list">{renderList()}</div>
      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
      {taskToDelete && (
        <ConfirmDialog
          title="Видалення завдання"
          message={`Ви дійсно хочете видалити завдання "${taskToDelete.title}"?`}
          confirmLabel="Видалити"
          isBusy={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </section>
  )
}

export default TasksPage
