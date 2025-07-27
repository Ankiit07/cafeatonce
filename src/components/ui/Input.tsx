import React, { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/utils'
import type { InputProps } from '@/types'

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const id = useId()
  const isControlled = value !== undefined

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(e.target.value)
  }

  const inputClasses = cn(
    'w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-75',
    error
      ? 'border-red-300 focus:ring-red-500'
      : 'border-gray-300 hover:border-gray-400',
    className
  )

  const InputComponent = type === 'textarea' ? 'textarea' : 'input'

  return (
    <div className='space-y-1'>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-red-700' : 'text-gray-700',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </label>
      )}

      <div className='relative'>
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <InputComponent
            id={id}
            type={type === 'textarea' ? undefined : type}
            placeholder={placeholder}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            className={inputClasses}
            rows={type === 'textarea' ? 3 : undefined}
            {...props}
          />
        </motion.div>

        {error && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            <AlertCircle className='h-4 w-4 text-red-500' />
          </div>
        )}
      </div>

      <AnimatePresence mode='wait'>
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}
          >
            {error || helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
