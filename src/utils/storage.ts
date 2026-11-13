// Безпечна робота з localStorage: будь-яка помилка (недоступне сховище, пошкоджений JSON)
// не ламає застосунок, а повертає значення за замовчуванням

export function readStorage<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }
    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) {
      return fallback
    }
    return parsed as T
  } catch {
    return fallback
  }
}

// Повертає false, якщо запис не вдався (наприклад, переповнене сховище)
export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
