# Study Planner

Лабораторна робота №8: React Fundamentals (компоненти, JSX, props, useState, події, списки).
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
  components/   Header, TaskForm, TaskStats, TaskFilters, TaskSearch, TaskList, TaskItem (+ .scss кожного)
  types/        task.ts: Task, NewTask, Priority, TaskFilter
  data/         initialTasks.ts: початкові дані
  styles/       _variables.scss, global.scss
  App.tsx       єдине місце зі станом (tasks, filter, query) і обробниками
  main.tsx
```

```
App
├── Header
├── TaskForm
├── TaskStats
├── TaskSearch
├── TaskFilters
└── TaskList
    └── TaskItem (для кожного завдання)
```

## Що реалізовано

- Список завдань (`map` зі стабільним `key = task.id`), додавання, позначення виконаним / повернення, видалення.
- Незмінні оновлення масиву: `[new, ...prev]`, `prev.map(...)`, `prev.filter(...)`.
- Фільтри Всі / Виконані / Не виконані: список для екрана обчислюється під час рендеру, масив `tasks` не змінюється.
- Статистика (усього / виконано / не виконано) обчислюється з поточного масиву, без окремого state.
- Умовний рендеринг: порожній список, порожній результат фільтра, позначка виконаного завдання.
- Валідація назви без бібліотек, помилка показується на сторінці (без `alert`).
- Додатково: пошук за назвою, лічильники в кнопках фільтра, кнопка «Очистити виконані».
- Стилі: SCSS + BEM, стилі компонента лежать поруч із ним.
