import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskSearch from './components/TaskSearch'
import TaskStats from './components/TaskStats'
import ToastHost from './components/ToastHost'
import { useTaskContext } from './hooks/useTaskContext'
import './App.scss'

// App більше не тримає state і не передає його через props: компоненти беруть усе з TaskContext
function App() {
  const { editingTask } = useTaskContext()

  return (
    <div className="app">
      <Header />
      {/* key: при переході між створенням і редагуванням (або іншим завданням) форма починає з нуля */}
      <TaskForm key={editingTask?.id ?? 'new'} />
      <TaskStats />
      <TaskSearch />
      <TaskFilters />
      <TaskList />
      <ToastHost />
    </div>
  )
}

export default App
