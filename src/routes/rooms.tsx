import { createFileRoute, redirect } from '@tanstack/react-router'
import Rooms from '../features/rooms/components/Rooms'

export const Route = createFileRoute('/rooms')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/auth' })
    }
  },
  component: () => <Rooms />,
})
