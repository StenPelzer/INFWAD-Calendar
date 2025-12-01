import { useMutation } from '@apollo/client/react'
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/auth'
import { useAuth } from '../context/AuthContext'
import type { User } from '../context/AuthContext'

interface AuthPayload {
  success: boolean
  token: string | null
  error: string | null
  user: User | null
}

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

export function useRegister() {
  const { login } = useAuth()

  const [registerMutation, { loading, error }] = useMutation<
    { register: AuthPayload },
    { input: RegisterInput }
  >(REGISTER_MUTATION)

  const register = async (input: RegisterInput) => {
    const result = await registerMutation({ variables: { input } })
    const payload = result.data?.register

    if (payload?.success && payload.token && payload.user) {
      login(payload.token, payload.user)
      return { success: true, error: null }
    }

    return {
      success: false,
      error: payload?.error ?? 'Registration failed',
    }
  }

  return { register, loading, error }
}

export function useLogin() {
  const { login } = useAuth()

  const [loginMutation, { loading, error }] = useMutation<
    { login: AuthPayload },
    { input: LoginInput }
  >(LOGIN_MUTATION)

  const doLogin = async (input: LoginInput) => {
    const result = await loginMutation({ variables: { input } })
    const payload = result.data?.login

    if (payload?.success && payload.token && payload.user) {
      login(payload.token, payload.user)
      return { success: true, error: null }
    }

    return {
      success: false,
      error: payload?.error ?? 'Login failed',
    }
  }

  return { login: doLogin, loading, error }
}
