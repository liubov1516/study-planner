import { httpClient, HttpError } from '../api/httpClient'
import type { ApiTodo, TodosResponse } from '../types/api'
import type { NewTask, Task, TaskChanges, TaskListParams, TaskPage } from '../types/task'
import { DEFAULT_USER_ID, toTask } from './taskMapper'

// Repository ховає від UI endpoint-и, формат DTO та обмеження навчального API.
//
// DummyJSON лише імітує POST, PATCH і DELETE: відповідь успішна, але сервер нічого не зберігає.
// Щоб інтерфейс поводився так, ніби зміни збереглися, repository запам'ятовує їх
// у пам'яті на час сеансу і накладає на кожну відповідь сервера.
const createdTasks: Task[] = []
const changedTasks = new Map<number, Task>()
const deletedIds = new Set<number>()
let lastLocalId = 0

function isCreatedLocally(id: number): boolean {
  return createdTasks.some((task) => task.id === id)
}

function applyChanges(task: Task): Task {
  return changedTasks.get(task.id) ?? task
}

function matchesQuery(task: Task, query: string): boolean {
  return task.title.toLowerCase().includes(query.toLowerCase())
}

async function getAll({ limit, skip, query = '', signal }: TaskListParams): Promise<TaskPage> {
  const params = `limit=${limit}&skip=${skip}`
  const path = query ? `/todos/search?q=${encodeURIComponent(query)}&${params}` : `/todos?${params}`
  const data = await httpClient.get<TodosResponse>(path, signal)

  const fromServer = data.todos
    .filter((todo) => !deletedIds.has(todo.id))
    .map((todo) => applyChanges(toTask(todo)))

  // Створені в цьому сеансі завдання показуємо на початку першої сторінки
  const created = query ? createdTasks.filter((task) => matchesQuery(task, query)) : createdTasks
  const tasks = skip === 0 ? [...created, ...fromServer] : fromServer

  // Видалені завдання враховуємо в total лише без пошуку (скільки з них підпадає під пошук, невідомо)
  const deletedCount = query ? 0 : deletedIds.size
  return { tasks, total: Math.max(0, data.total - deletedCount + created.length) }
}

async function getById(id: number, signal?: AbortSignal): Promise<Task> {
  const created = createdTasks.find((task) => task.id === id)
  if (created) {
    return created
  }
  if (deletedIds.has(id)) {
    throw new HttpError(404, 'Завдання видалено.')
  }
  const todo = await httpClient.get<ApiTodo>(`/todos/${id}`, signal)
  return applyChanges(toTask(todo))
}

async function create(data: NewTask): Promise<Task> {
  const response = await httpClient.post<ApiTodo>('/todos/add', {
    todo: data.title,
    completed: false,
    userId: DEFAULT_USER_ID,
  })
  // DummyJSON завжди повертає однаковий id, а ключі в списку мають бути унікальними
  lastLocalId = Math.max(response.id, lastLocalId + 1)
  const task: Task = { ...data, id: lastLocalId, title: response.todo, completed: false }
  createdTasks.unshift(task)
  return task
}

async function update(id: number, changes: TaskChanges): Promise<Task> {
  // Завдання, створене локально, на сервері не існує (PATCH повернув би 404)
  const local = createdTasks.find((task) => task.id === id)
  if (local) {
    const updated: Task = { ...local, ...changes, id }
    createdTasks.splice(createdTasks.indexOf(local), 1, updated)
    return updated
  }

  // На сервер надсилаються лише поля, які він підтримує
  const response = await httpClient.patch<ApiTodo>(`/todos/${id}`, {
    ...(changes.title !== undefined && { todo: changes.title }),
    ...(changes.completed !== undefined && { completed: changes.completed }),
  })
  // Сервер нічого не зберігає, тому за основу беремо раніше запам'ятовану версію
  const base = changedTasks.get(id) ?? toTask(response)
  const updated: Task = { ...base, ...changes, id }
  changedTasks.set(id, updated)
  return updated
}

async function remove(id: number): Promise<void> {
  if (isCreatedLocally(id)) {
    createdTasks.splice(
      createdTasks.findIndex((task) => task.id === id),
      1,
    )
    return
  }
  await httpClient.delete<ApiTodo>(`/todos/${id}`)
  deletedIds.add(id)
  changedTasks.delete(id)
}

export const taskRepository = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
}
