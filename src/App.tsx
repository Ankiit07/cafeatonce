import { FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { TodoList } from '@/components/TodoList'
import { useTodoStore } from '@/stores/todoStore'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className='w-5 h-5 text-green-500' />
    case 'error':
      return <AlertCircle className='w-5 h-5 text-red-500' />
    case 'warning':
      return <AlertTriangle className='w-5 h-5 text-yellow-500' />
    case 'info':
      return <Info className='w-5 h-5 text-blue-500' />
    default:
      return <Info className='w-5 h-5 text-blue-500' />
  }
}

const App: FC = () => {
  const { notifications, removeNotification, getTodoStats } = useTodoStore()
  const stats = getTodoStats()

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-soft border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>T</span>
              </div>
              <h1 className='text-xl font-bold text-gray-900'>TodoApp</h1>
            </div>

            {/* Stats */}
            <div className='hidden sm:flex items-center gap-6 text-sm text-gray-600'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
                <span>{stats.total} Total</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>{stats.completed} Done</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                <span>{stats.pending} Pending</span>
              </div>
              {stats.overdue > 0 && (
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                  <span>{stats.overdue} Overdue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TodoList />
        </motion.div>
      </main>

      {/* Notifications */}
      <div className='fixed top-4 right-4 z-50 space-y-2 max-w-sm'>
        <AnimatePresence mode='popLayout'>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'bg-white rounded-lg shadow-hard border p-4 flex items-start gap-3',
                'max-w-sm w-full pointer-events-auto'
              )}
            >
              <NotificationIcon type={notification.type} />
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-medium text-gray-900'>
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className='text-sm text-gray-600 mt-1'>
                    {notification.message}
                  </p>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeNotification(notification.id)}
                className='p-1 h-6 w-6 flex-shrink-0'
              >
                <X className='w-4 h-4' />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className='mt-16 bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='text-center text-sm text-gray-600'>
            <p>Built with React, TypeScript, Tailwind CSS, and Framer Motion</p>
            <p className='mt-1'>A modern, production-grade TODO application</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
