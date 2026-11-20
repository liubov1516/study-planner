import { useEffect, useState } from 'react'

// Повертає значення із затримкою: оновлюється, лише коли користувач перестав змінювати вхідне
// значення на delayMs. Так запит до сервера надсилається не на кожну літеру
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delayMs)
    // cleanup скасовує попередній таймер, якщо значення змінилось раніше
    return () => clearTimeout(timerId)
  }, [value, delayMs])

  return debounced
}
