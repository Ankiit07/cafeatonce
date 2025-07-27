export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  category: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface TodoFilter {
  status?: 'all' | 'active' | 'completed'
  priority?: Priority
  category?: string
  search?: string
  tag?: string
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
  byPriority: Record<Priority, number>
  byCategory: Record<string, number>
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  defaultCategory: string
  defaultPriority: Priority
  notifications: boolean
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title'
  sortOrder: 'asc' | 'desc'
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
  createdAt: Date
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  timestamp: Date
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: LoadingState
  error: string | null
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

export interface AppState {
  todos: AsyncState<Todo[]>
  categories: AsyncState<Category[]>
  user: AsyncState<User>
  filters: TodoFilter
  notifications: NotificationState[]
}

// Form types
export interface CreateTodoForm {
  title: string
  description?: string
  priority: Priority
  category: string
  dueDate?: Date
  tags: string[]
}

export interface UpdateTodoForm extends Partial<CreateTodoForm> {
  completed?: boolean
}

export interface CreateCategoryForm {
  name: string
  color: string
  icon?: string
}

// Component prop types
export interface ComponentWithChildren {
  children: React.ReactNode
}

export interface ComponentWithClassName {
  className?: string
}

export interface ButtonProps
  extends ComponentWithChildren,
    ComponentWithClassName {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends ComponentWithClassName {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea'
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
}
