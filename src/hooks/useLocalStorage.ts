import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

// Звичайний useState, значення якого зберігається в localStorage.
// Призначений для простих налаштувань (наприклад, активний фільтр),
// а не для списку завдань: ним керує reducer
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  // Ліниве початкове значення: сховище читається лише при першому рендері
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue, isValid))

  // Побічний ефект: після кожної зміни синхронізуємо значення зі сховищем
  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
