import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogin, useRegister } from '../../../hooks/useAuthMutations'
import '../assets/auth.scss'

type AuthMode = 'login' | 'register'

export default function AuthForm() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  const { login, loading: loginLoading } = useLogin()
  const { register, loading: registerLoading } = useRegister()

  const loading = loginLoading || registerLoading

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match')
        return
      }

      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters')
        return
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        navigate({ to: '/' })
      } else {
        setFormError(result.error)
      }
    } else {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        navigate({ to: '/' })
      } else {
        setFormError(result.error)
      }
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
    setFormError(null)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in to access your calendar'
              : 'Join us to start organizing your schedule'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
          )}

          {formError && <div className="form-error">{formError}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="loading-spinner" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <button
              type="button"
              onClick={toggleMode}
              className="auth-toggle"
              disabled={loading}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <div className="auth-decoration">
        <div className="decoration-circle circle-1" />
        <div className="decoration-circle circle-2" />
        <div className="decoration-circle circle-3" />
      </div>
    </div>
  )
}
