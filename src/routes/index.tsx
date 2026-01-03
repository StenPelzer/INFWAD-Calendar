import { createFileRoute, redirect } from '@tanstack/react-router'
import Calendar from '../features/calendar/components/Calendar'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Redirect to auth if not logged in
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/auth' })
    }
  },
  component: Calendar,
})
