import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Clock,
  Tag,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Calendar,
} from 'lucide-react'
import { cn, formatDate, getPriorityColor, isOverdue } from '@/utils'
import { useTodoStore } from '@/stores/todoStore'
import { Button } from '@/components/ui'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onEdit?: (todo: Todo) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toggleTodo, deleteTodo, duplicateTodo, getCategoryById } =
    useTodoStore()

  const category = getCategoryById(todo.category)
  const isTaskOverdue = todo.dueDate && isOverdue(todo.dueDate)

  const handleToggle = () => {
    toggleTodo(todo.id)
  }

  const handleEdit = () => {
    onEdit?.(todo)
    setIsMenuOpen(false)
  }

  const handleDelete = () => {
    deleteTodo(todo.id)
    setIsMenuOpen(false)
  }

  const handleDuplicate = () => {
    duplicateTodo(todo.id)
    setIsMenuOpen(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'group bg-white rounded-xl p-4 shadow-soft border border-gray-100 transition-all duration-200',
        'hover:shadow-medium hover:border-gray-200',
        todo.completed && 'opacity-75'
      )}
    >
      <div className='flex items-start gap-3'>
        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          className={cn(
            'mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            todo.completed
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-gray-300 hover:border-primary-500'
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className='w-3 h-3' />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          {/* Title and Priority */}
          <div className='flex items-start justify-between mb-2'>
            <h3
              className={cn(
                'font-medium text-gray-900 transition-all duration-200',
                todo.completed && 'line-through text-gray-500'
              )}
            >
              {todo.title}
            </h3>

            <div className='flex items-center gap-2 ml-2'>
              {/* Priority Badge */}
              <span
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full capitalize',
                  getPriorityColor(todo.priority)
                )}
              >
                {todo.priority}
              </span>

              {/* Actions Menu */}
              <div className='relative'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className='opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0'
                >
                  <MoreHorizontal className='w-4 h-4' />
                </Button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className='absolute right-0 top-8 bg-white rounded-lg shadow-hard border border-gray-200 py-1 z-10 min-w-32'
                  >
                    <button
                      onClick={handleEdit}
                      className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2'
                    >
                      <Edit2 className='w-4 h-4' />
                      Edit
                    </button>
                    <button
                      onClick={handleDuplicate}
                      className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2'
                    >
                      <Copy className='w-4 h-4' />
                      Duplicate
                    </button>
                    <button
                      onClick={handleDelete}
                      className='w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2'
                    >
                      <Trash2 className='w-4 h-4' />
                      Delete
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {todo.description && (
            <p
              className={cn(
                'text-sm text-gray-600 mb-3 line-clamp-2',
                todo.completed && 'line-through'
              )}
            >
              {todo.description}
            </p>
          )}

          {/* Meta Information */}
          <div className='flex items-center gap-4 text-xs text-gray-500'>
            {/* Category */}
            {category && (
              <div className='flex items-center gap-1'>
                <div
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
            )}

            {/* Due Date */}
            {todo.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isTaskOverdue && !todo.completed && 'text-red-600'
                )}
              >
                <Calendar className='w-3 h-3' />
                <span>{formatDate(todo.dueDate)}</span>
                {isTaskOverdue && !todo.completed && (
                  <Clock className='w-3 h-3' />
                )}
              </div>
            )}

            {/* Tags */}
            {todo.tags.length > 0 && (
              <div className='flex items-center gap-1'>
                <Tag className='w-3 h-3' />
                <span>{todo.tags.slice(0, 2).join(', ')}</span>
                {todo.tags.length > 2 && <span>+{todo.tags.length - 2}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 z-0'
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </motion.div>
  )
}
