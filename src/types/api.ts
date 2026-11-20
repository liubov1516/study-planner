// DTO: форма даних, яку повертає DummyJSON (https://dummyjson.com/docs/todos)
export interface ApiTodo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface TodosResponse {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}
