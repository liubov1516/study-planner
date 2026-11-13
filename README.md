# Study Planner

Лабораторні роботи №8 і №9: React Fundamentals та React State/Effects
(Context API, useReducer, useEffect, Custom Hooks, localStorage).
Стек: React 19, TypeScript, Vite, SCSS + BEM, ESLint.

## Запуск

```sh
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

Потрібен Node.js 22.22 або новіший.

## Структура

```
src/
  components/   Header, TaskForm, TaskStats, TaskSearch, TaskFilters, TaskList, TaskItem, Toast, ToastHost (+ .scss)
  context/      TaskContext.ts (контекст і його тип), TaskProvider.tsx (стан, ефекти, операції)
  hooks/        useTaskContext, useLocalStorage, useDocumentTitle
  reducers/     taskReducer.ts (чиста функція + типи action)
  types/        task.ts, toast.ts
  data/         initialTasks.ts, constants.ts
  utils/        storage.ts (безпечний localStorage), guards.ts (перевірка збережених даних)
  styles/       _variables.scss, global.scss
```

## Як організовано state (лабораторна №9)

- **useReducer**: `taskReducer` керує `tasks` і видаленням, що очікує підтвердження. Дії: `add`, `toggle`, `update`,
  `requestDelete`, `confirmDelete`, `undoDelete`, `clearCompleted`, `reset`. Reducer чистий: без таймерів, DOM та localStorage.
- **Context API**: `TaskProvider` створює значення контексту, компоненти беруть його через `useTaskContext()`
  (поза провайдером кидається зрозуміла помилка). Значення контексту мемоїзоване (`useMemo` + `useCallback`).
- **useEffect** (у `TaskProvider`): запис `tasks` у localStorage, таймер Undoable Delete з `clearTimeout` у cleanup.
  Заголовок вкладки синхронізує `useDocumentTitle`.
- **localStorage**: `tasks` читаються під час ініціалізації reducer (пошкоджений JSON або неправильна форма даних
  замінюються початковим списком). Активний фільтр зберігається через `useLocalStorage`. Reducer залишається
  єдиним джерелом правди, localStorage лише зберігає копію.
- **Derived state**: відфільтрований список і статистика обчислюються під час рендеру, без useEffect.
- **Undoable Delete**: «Видалити» позначає завдання «Буде видалено», показує Toast із прогресом 5 секунд і кнопкою
  «Скасувати». Після таймера виконується `confirmDelete`. Так само працює «Очистити виконані».
- **Toast**: власний компонент без бібліотек (створення, редагування, видалення, помилки). Автозакриття таймером
  через `useEffectEvent`: актуальний `onClose` читається в момент спрацювання, тому новий callback від батька
  не перезапускає таймер.

## Запуск

Див. розділ вище. Дані зберігаються в localStorage (ключі `study-planner:tasks` та `study-planner:filter`),
кнопка «Скинути дані» повертає початковий список.
