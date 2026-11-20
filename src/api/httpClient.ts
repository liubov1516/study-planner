// Єдине місце, яке знає про fetch, базову адресу та обробку HTTP-статусів.
// Компоненти й hooks цього модуля напряму не використовують: вони працюють через repository.

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  // Сигнал AbortController: дозволяє скасувати запит, який ще виконується
  signal?: AbortSignal
}

// Помилка відповіді сервера (статус не 2xx). Вищий рівень може показати її користувачу
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

function buildUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new Error('Не задано VITE_API_URL. Створіть файл .env за прикладом .env.example.')
  }
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

// DummyJSON повертає помилку у форматі { "message": "..." }
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const { message } = data as { message: unknown }
      if (typeof message === 'string') {
        return message
      }
    }
  } catch {
    // Тіло відповіді не JSON: використаємо статус
  }
  return response.statusText || `HTTP ${response.status}`
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options

  const response = await fetch(buildUrl(path), {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  // fetch не кидає помилку для статусів 4xx/5xx, тому response.ok перевіряємо самі
  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response))
  }
  return (await response.json()) as T
}

export const httpClient = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// Скасований запит не є помилкою завантаження: його не треба показувати користувачу
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}
