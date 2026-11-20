import './TaskSearch.scss'

interface TaskSearchProps {
  value: string
  onChange: (value: string) => void
}

function TaskSearch({ value, onChange }: TaskSearchProps) {
  return (
    <div className="task-search">
      <label className="visually-hidden" htmlFor="task-search">
        Пошук за назвою
      </label>
      <input
        id="task-search"
        className="task-search__input"
        type="search"
        value={value}
        placeholder="Пошук за назвою"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default TaskSearch
