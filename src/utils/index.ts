import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isYesterday, isPast } from 'date-fns'
import type { Todo, Priority, TodoStats } from '@/types'

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Date utilities
export function formatDate(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM dd, yyyy')
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy h:mm a')
}

export function isOverdue(date: Date): boolean {
  return isPast(date) && !isToday(date)
}

// Priority utilities
export function getPriorityColor(priority: Priority): string {
  const colors = {
    low: 'text-gray-500 bg-gray-100',
    medium: 'text-yellow-700 bg-yellow-100',
    high: 'text-orange-700 bg-orange-100',
    urgent: 'text-red-700 bg-red-100',
  }
  return colors[priority]
}

export function getPriorityValue(priority: Priority): number {
  const values = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  }
  return values[priority]
}

// Todo utilities
export function sortTodos(
  todos: Todo[],
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title',
  sortOrder: 'asc' | 'desc' = 'asc'
): Todo[] {
  const sorted = [...todos].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0
        else if (!a.dueDate) comparison = 1
        else if (!b.dueDate) comparison = -1
        else comparison = a.dueDate.getTime() - b.dueDate.getTime()
        break
      case 'priority':
        comparison = getPriorityValue(b.priority) - getPriorityValue(a.priority)
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

export function filterTodos(
  todos: Todo[],
  filter: {
    status?: 'all' | 'active' | 'completed'
    priority?: Priority
    category?: string
    search?: string
    tag?: string
  }
): Todo[] {
  return todos.filter(todo => {
    // Status filter
    if (filter.status === 'active' && todo.completed) return false
    if (filter.status === 'completed' && !todo.completed) return false

    // Priority filter
    if (filter.priority && todo.priority !== filter.priority) return false

    // Category filter
    if (filter.category && todo.category !== filter.category) return false

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      const matchesTitle = todo.title.toLowerCase().includes(searchLower)
      const matchesDescription = todo.description
        ?.toLowerCase()
        .includes(searchLower)
      if (!matchesTitle && !matchesDescription) return false
    }

    // Tag filter
    if (filter.tag && !todo.tags.includes(filter.tag)) return false

    return true
  })
}

export function calculateTodoStats(todos: Todo[]): TodoStats {
  const stats: TodoStats = {
    total: todos.length,
    completed: 0,
    pending: 0,
    overdue: 0,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    },
    byCategory: {},
  }

  todos.forEach(todo => {
    // Status counts
    if (todo.completed) {
      stats.completed++
    } else {
      stats.pending++
      // Check if overdue
      if (todo.dueDate && isOverdue(todo.dueDate)) {
        stats.overdue++
      }
    }

    // Priority counts
    stats.byPriority[todo.priority]++

    // Category counts
    const category = todo.category
    if (stats.byCategory[category]) {
      stats.byCategory[category]++
    } else {
      stats.byCategory[category] = 1
    }
  })

  return stats
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Storage utilities
export function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Handle storage errors silently
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Handle storage errors silently
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// Error handling
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key])
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}
