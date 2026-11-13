import { useEffect } from 'react'

// Синхронізує React state із зовнішньою системою - заголовком вкладки браузера
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title
  }, [title])
}
