import { createFileRoute, redirect } from '@tanstack/react-router'
import AuthForm from '../features/auth/components/AuthForm'

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    // Redirect if already logged in
    const token = localStorage.getItem('auth_token')
    if (token) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthPage,
})

function AuthPage() {
  return <AuthForm />
}
