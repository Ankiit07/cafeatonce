import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Todo,
  TodoFilter,
  CreateTodoForm,
  UpdateTodoForm,
  Category,
  CreateCategoryForm,
  NotificationState,
} from '@/types'
import { generateId, filterTodos, calculateTodoStats } from '@/utils'

interface TodoStore {
  // State
  todos: Todo[]
  categories: Category[]
  filters: TodoFilter
  notifications: NotificationState[]
  isLoading: boolean
  error: string | null

  // Todo actions
  addTodo: (todo: CreateTodoForm) => void
  updateTodo: (id: string, updates: UpdateTodoForm) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  duplicateTodo: (id: string) => void
  bulkDeleteTodos: (ids: string[]) => void
  bulkUpdateTodos: (ids: string[], updates: UpdateTodoForm) => void

  // Category actions
  addCategory: (category: CreateCategoryForm) => void
  updateCategory: (id: string, updates: Partial<CreateCategoryForm>) => void
  deleteCategory: (id: string) => void

  // Filter actions
  setFilter: (filter: Partial<TodoFilter>) => void
  clearFilters: () => void

  // Notification actions
  addNotification: (notification: Omit<NotificationState, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Computed getters
  getFilteredTodos: () => Todo[]
  getTodoStats: () => ReturnType<typeof calculateTodoStats>
  getTodoById: (id: string) => Todo | undefined
  getCategoryById: (id: string) => Category | undefined

  // Utility actions
  exportData: () => string
  importData: (data: string) => void
  clearAllData: () => void
}

// Default categories
const defaultCategories: Category[] = [
  {
    id: 'personal',
    name: 'Personal',
    color: '#3B82F6',
    icon: 'User',
    createdAt: new Date(),
  },
  {
    id: 'work',
    name: 'Work',
    color: '#F59E0B',
    icon: 'Briefcase',
    createdAt: new Date(),
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#10B981',
    icon: 'ShoppingCart',
    createdAt: new Date(),
  },
  {
    id: 'health',
    name: 'Health',
    color: '#EF4444',
    icon: 'Heart',
    createdAt: new Date(),
  },
]

// Default filters
const defaultFilters: TodoFilter = {
  status: 'all',
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      // Initial state
      todos: [],
      categories: defaultCategories,
      filters: defaultFilters,
      notifications: [],
      isLoading: false,
      error: null,

      // Todo actions
      addTodo: (todoData: CreateTodoForm) => {
        const newTodo: Todo = {
          id: generateId(),
          ...todoData,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: todoData.dueDate || undefined,
        }

        set(state => ({
          todos: [...state.todos, newTodo],
        }))

        get().addNotification({
          type: 'success',
          title: 'Todo created',
          message: `"${newTodo.title}" has been added to your list`,
          duration: 3000,
        })
      },

      updateTodo: (id: string, updates: UpdateTodoForm) => {
        set(state => ({
          todos: state.todos.map(todo =>
            todo.id === id
              ? {
                  ...todo,
                  ...updates,
                  updatedAt: new Date(),
                }
              : todo
          ),
        }))

        const todo = get().getTodoById(id)
        if (todo) {
          get().addNotification({
            type: 'success',
            title: 'Todo updated',
            message: `"${todo.title}" has been updated`,
            duration: 2000,
          })
        }
      },

      deleteTodo: (id: string) => {
        const todo = get().getTodoById(id)

        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id),
        }))

        if (todo) {
          get().addNotification({
            type: 'success',
            title: 'Todo deleted',
            message: `"${todo.title}" has been removed`,
            duration: 2000,
          })
        }
      },

      toggleTodo: (id: string) => {
        const todo = get().getTodoById(id)
        if (!todo) return

        const newCompletedState = !todo.completed
        get().updateTodo(id, { completed: newCompletedState })

        get().addNotification({
          type: 'success',
          title: newCompletedState ? 'Todo completed' : 'Todo reopened',
          message: `"${todo.title}" marked as ${newCompletedState ? 'completed' : 'pending'}`,
          duration: 2000,
        })
      },

      duplicateTodo: (id: string) => {
        const todo = get().getTodoById(id)
        if (!todo) return

        const duplicatedTodo: CreateTodoForm = {
          title: `${todo.title} (Copy)`,
          description: todo.description,
          priority: todo.priority,
          category: todo.category,
          dueDate: todo.dueDate,
          tags: [...todo.tags],
        }

        get().addTodo(duplicatedTodo)
      },

      bulkDeleteTodos: (ids: string[]) => {
        set(state => ({
          todos: state.todos.filter(todo => !ids.includes(todo.id)),
        }))

        get().addNotification({
          type: 'success',
          title: 'Todos deleted',
          message: `${ids.length} todo(s) have been deleted`,
          duration: 2000,
        })
      },

      bulkUpdateTodos: (ids: string[], updates: UpdateTodoForm) => {
        set(state => ({
          todos: state.todos.map(todo =>
            ids.includes(todo.id)
              ? {
                  ...todo,
                  ...updates,
                  updatedAt: new Date(),
                }
              : todo
          ),
        }))

        get().addNotification({
          type: 'success',
          title: 'Todos updated',
          message: `${ids.length} todo(s) have been updated`,
          duration: 2000,
        })
      },

      // Category actions
      addCategory: (categoryData: CreateCategoryForm) => {
        const newCategory: Category = {
          id: generateId(),
          ...categoryData,
          createdAt: new Date(),
        }

        set(state => ({
          categories: [...state.categories, newCategory],
        }))

        get().addNotification({
          type: 'success',
          title: 'Category created',
          message: `"${newCategory.name}" category has been added`,
          duration: 2000,
        })
      },

      updateCategory: (id: string, updates: Partial<CreateCategoryForm>) => {
        set(state => ({
          categories: state.categories.map(category =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }))
      },

      deleteCategory: (id: string) => {
        const category = get().getCategoryById(id)

        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id),
          todos: state.todos.map(todo =>
            todo.category === id
              ? { ...todo, category: 'personal', updatedAt: new Date() }
              : todo
          ),
        }))

        if (category) {
          get().addNotification({
            type: 'warning',
            title: 'Category deleted',
            message: `"${category.name}" category has been removed. Todos moved to Personal.`,
            duration: 3000,
          })
        }
      },

      // Filter actions
      setFilter: (filter: Partial<TodoFilter>) => {
        set(state => ({
          filters: { ...state.filters, ...filter },
        }))
      },

      clearFilters: () => {
        set({ filters: defaultFilters })
      },

      // Notification actions
      addNotification: (notification: Omit<NotificationState, 'id'>) => {
        const newNotification: NotificationState = {
          id: generateId(),
          ...notification,
          duration: notification.duration || 5000,
        }

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }))

        // Auto-remove notification after duration
        if (!notification.persistent && newNotification.duration) {
          setTimeout(() => {
            get().removeNotification(newNotification.id)
          }, newNotification.duration)
        }
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(notif => notif.id !== id),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // Computed getters
      getFilteredTodos: () => {
        const { todos, filters } = get()
        return filterTodos(todos, filters)
      },

      getTodoStats: () => {
        const todos = get().todos
        return calculateTodoStats(todos)
      },

      getTodoById: (id: string) => {
        return get().todos.find(todo => todo.id === id)
      },

      getCategoryById: (id: string) => {
        return get().categories.find(category => category.id === id)
      },

      // Utility actions
      exportData: () => {
        const { todos, categories } = get()
        const data = { todos, categories, exportedAt: new Date() }
        return JSON.stringify(data, null, 2)
      },

      importData: (dataString: string) => {
        try {
          const data = JSON.parse(dataString)

          if (data.todos && Array.isArray(data.todos)) {
            set(state => ({
              todos: [...state.todos, ...data.todos],
            }))
          }

          if (data.categories && Array.isArray(data.categories)) {
            set(state => ({
              categories: [...state.categories, ...data.categories],
            }))
          }

          get().addNotification({
            type: 'success',
            title: 'Data imported',
            message: 'Your data has been successfully imported',
            duration: 3000,
          })
        } catch (error) {
          get().addNotification({
            type: 'error',
            title: 'Import failed',
            message: 'Failed to import data. Please check the file format.',
            duration: 5000,
          })
        }
      },

      clearAllData: () => {
        set({
          todos: [],
          categories: defaultCategories,
          filters: defaultFilters,
          notifications: [],
        })

        get().addNotification({
          type: 'success',
          title: 'Data cleared',
          message: 'All data has been cleared successfully',
          duration: 3000,
        })
      },
    }),
    {
      name: 'todo-store',
      partialize: state => ({
        todos: state.todos,
        categories: state.categories,
        filters: state.filters,
      }),
    }
  )
)
