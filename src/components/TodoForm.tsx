import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTodoStore } from '@/stores/todoStore'
import { Button, Input, Modal } from '@/components/ui'
import { cn } from '@/utils'
import type { Todo, Priority, CreateTodoForm } from '@/types'

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.string().min(1, 'Category is required'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()),
})

type TodoFormData = z.infer<typeof todoSchema>

interface TodoFormProps {
  isOpen: boolean
  onClose: () => void
  editTodo?: Todo | null
}

export const TodoForm: React.FC<TodoFormProps> = ({
  isOpen,
  onClose,
  editTodo,
}) => {
  const { addTodo, updateTodo, categories } = useTodoStore()
  const [tagInput, setTagInput] = React.useState('')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      category: 'personal',
      dueDate: '',
      tags: [],
    },
  })

  const watchedTags = watch('tags')

  // Reset form when opening/closing or when editTodo changes
  React.useEffect(() => {
    if (isOpen) {
      if (editTodo) {
        reset({
          title: editTodo.title,
          description: editTodo.description || '',
          priority: editTodo.priority,
          category: editTodo.category,
          dueDate: editTodo.dueDate
            ? editTodo.dueDate.toISOString().split('T')[0]
            : '',
          tags: editTodo.tags,
        })
      } else {
        reset({
          title: '',
          description: '',
          priority: 'medium',
          category: 'personal',
          dueDate: '',
          tags: [],
        })
      }
    }
  }, [isOpen, editTodo, reset])

  const onSubmit = (data: TodoFormData) => {
    const todoData: CreateTodoForm = {
      title: data.title,
      description: data.description || undefined,
      priority: data.priority as Priority,
      category: data.category,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      tags: data.tags,
    }

    if (editTodo) {
      updateTodo(editTodo.id, todoData)
    } else {
      addTodo(todoData)
    }

    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      watchedTags.filter(tag => tag !== tagToRemove)
    )
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-500 bg-gray-100' },
    {
      value: 'medium',
      label: 'Medium',
      color: 'text-yellow-700 bg-yellow-100',
    },
    { value: 'high', label: 'High', color: 'text-orange-700 bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-700 bg-red-100' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTodo ? 'Edit Todo' : 'Create New Todo'}
      size='lg'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Title */}
        <Controller
          name='title'
          control={control}
          render={({ field }) => (
            <Input
              label='Title'
              placeholder='What needs to be done?'
              required
              error={errors.title?.message}
              {...field}
            />
          )}
        />

        {/* Description */}
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Input
              type='textarea'
              label='Description'
              placeholder='Add some details...'
              error={errors.description?.message}
              {...field}
            />
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Priority */}
          <Controller
            name='priority'
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Priority
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {priorityOptions.map(option => (
                    <motion.button
                      key={option.value}
                      type='button'
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        'p-2 text-xs font-medium rounded-lg border transition-all duration-200',
                        field.value === option.value
                          ? `${option.color} border-current`
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          />

          {/* Category */}
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Category
                </label>
                <select
                  {...field}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />
        </div>

        {/* Due Date */}
        <Controller
          name='dueDate'
          control={control}
          render={({ field }) => (
            <Input
              type='date'
              label='Due Date'
              error={errors.dueDate?.message}
              {...field}
            />
          )}
        />

        {/* Tags */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Tags
          </label>

          {/* Tag Input */}
          <div className='flex gap-2'>
            <input
              type='text'
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              placeholder='Add a tag...'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
            <Button
              type='button'
              onClick={addTag}
              variant='outline'
              size='sm'
              disabled={!tagInput.trim()}
            >
              <Plus className='w-4 h-4' />
            </Button>
          </div>

          {/* Tag List */}
          {watchedTags.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {watchedTags.map((tag, index) => (
                <motion.span
                  key={`${tag}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs'
                >
                  {tag}
                  <button
                    type='button'
                    onClick={() => removeTag(tag)}
                    className='hover:text-primary-900'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' loading={isSubmitting} disabled={isSubmitting}>
            {editTodo ? 'Update Todo' : 'Create Todo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
