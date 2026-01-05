import { createFileRoute, redirect } from '@tanstack/react-router'
import Calendar from '../features/calendar/components/Calendar'

export const Route = createFileRoute('/list')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/auth' })
    }
  },
  component: () => <Calendar view="list" />,
})
