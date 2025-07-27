import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Plus,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Download,
  Upload,
} from 'lucide-react'
import { useTodoStore } from '@/stores/todoStore'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { Button, LoadingSpinner } from '@/components/ui'
import { cn, sortTodos, debounce } from '@/utils'
import type { Todo } from '@/types'

type ViewMode = 'list' | 'grid'
type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title'

export const TodoList: React.FC = () => {
  const {
    todos,
    categories,
    filters,
    isLoading,
    getFilteredTodos,
    setFilter,
    clearFilters,
    exportData,
    importData,
  } = useTodoStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setFilter({ search: term || '' })
      }, 300),
    [setFilter]
  )

  React.useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  // Get and sort filtered todos
  const filteredTodos = useMemo(() => {
    const filtered = getFilteredTodos()
    return sortTodos(filtered, sortBy, sortOrder)
  }, [getFilteredTodos, sortBy, sortOrder])

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTodo(null)
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        const data = e.target?.result as string
        importData(data)
      }
      reader.readAsText(file)
    }
  }

  const priorityOptions = ['low', 'medium', 'high', 'urgent'] as const
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ] as const

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>My Todos</h1>
          <p className='text-gray-600'>
            {filteredTodos.length} of {todos.length} todos
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setIsFormOpen(true)}
            className='flex items-center gap-2'
          >
            <Plus className='w-4 h-4' />
            Add Todo
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search todos...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* Controls */}
        <div className='flex items-center gap-2'>
          {/* Filters Toggle */}
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size='sm'
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className='w-4 h-4' />
            Filters
          </Button>

          {/* Sort */}
          <div className='relative'>
            <select
              value={sortBy}
              onChange={e => handleSort(e.target.value as SortBy)}
              className='appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
            >
              <option value='createdAt'>Created</option>
              <option value='dueDate'>Due Date</option>
              <option value='priority'>Priority</option>
              <option value='title'>Title</option>
            </select>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className='absolute right-0 top-0 h-full px-2'
            >
              {sortOrder === 'asc' ? (
                <SortAsc className='w-4 h-4' />
              ) : (
                <SortDesc className='w-4 h-4' />
              )}
            </Button>
          </div>

          {/* View Mode */}
          <div className='flex border border-gray-300 rounded-lg overflow-hidden'>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('list')}
              className='rounded-none border-0'
            >
              <List className='w-4 h-4' />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('grid')}
              className='rounded-none border-0'
            >
              <Grid className='w-4 h-4' />
            </Button>
          </div>

          {/* Export/Import */}
          <Button variant='outline' size='sm' onClick={handleExport}>
            <Download className='w-4 h-4' />
          </Button>

          <label className='cursor-pointer'>
            <div className='inline-block'>
              <Button variant='outline' size='sm'>
                <Upload className='w-4 h-4' />
              </Button>
            </div>
            <input
              type='file'
              accept='.json'
              onChange={handleImport}
              className='hidden'
            />
          </label>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='bg-gray-50 rounded-lg p-4 space-y-4 overflow-hidden'
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Status Filter */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <div className='flex gap-1'>
                  {statusOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={
                        filters.status === option.value ? 'primary' : 'outline'
                      }
                      size='sm'
                      onClick={() => setFilter({ status: option.value })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Priority
                </label>
                <div className='flex gap-1'>
                  <Button
                    variant={!filters.priority ? 'primary' : 'outline'}
                    size='sm'
                    onClick={() => setFilter({})}
                  >
                    All
                  </Button>
                  {priorityOptions.map(priority => (
                    <Button
                      key={priority}
                      variant={
                        filters.priority === priority ? 'primary' : 'outline'
                      }
                      size='sm'
                      onClick={() => setFilter({ priority: priority as any })}
                      className='capitalize'
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={e => setFilter({ category: e.target.value || '' })}
                  className='w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                >
                  <option value=''>All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex justify-end'>
              <Button variant='outline' size='sm' onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Todo List */}
      {isLoading ? (
        <div className='flex justify-center py-12'>
          <LoadingSpinner size='lg' />
        </div>
      ) : filteredTodos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center py-12'
        >
          <div className='text-gray-400 mb-4'>
            <List className='w-16 h-16 mx-auto' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {todos.length === 0
              ? 'No todos yet'
              : 'No todos match your filters'}
          </h3>
          <p className='text-gray-600 mb-4'>
            {todos.length === 0
              ? 'Create your first todo to get started'
              : 'Try adjusting your search or filters'}
          </p>
          {todos.length === 0 && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className='w-4 h-4 mr-2' />
              Create Todo
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className={cn(
            'space-y-3',
            viewMode === 'grid' &&
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0'
          )}
        >
          <AnimatePresence mode='popLayout'>
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onEdit={handleEditTodo} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTodo={editingTodo}
      />
    </div>
  )
}
