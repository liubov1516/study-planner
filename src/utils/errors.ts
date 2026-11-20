import { HttpError } from '../api/httpClient'

// Перетворює будь-яку помилку на зрозумілий текст для користувача
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 404) {
      return 'Завдання не знайдено (404).'
    }
    if (error.status >= 500) {
      return `Помилка сервера (${error.status}). Спробуйте пізніше.`
    }
    return error.message
  }
  // fetch кидає TypeError, коли немає з'єднання
  if (error instanceof TypeError) {
    return 'Не вдалося з’єднатися із сервером. Перевірте підключення до інтернету.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Сталася невідома помилка.'
}
