import clientApi from '@/lib/clientApi'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type User = {
  _id: string
  name: string
  email: string
  [key: string]: any
}

type Session = {
  isLoading: boolean
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ user?: User; error?: string }>
  logout: () => Promise<void>
  user?: User
}

const SessionContext = createContext<Session>({
  isLoading: false,
  login: args => Promise.resolve({ user: undefined, error: undefined }),
  logout: async () => {},
})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>()
  const [isLoading, setLoading] = useState(true)

  const logout = async () => {
    setLoading(true)

    try {
      await clientApi.post('/api/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setUser(undefined)
      setLoading(false)
    }
  }

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ user?: User; error?: string }> => {
    // Simple validation
    if (!email.trim()) {
      return { error: 'Please enter your email address' }
    }

    if (!password) {
      return { error: 'Please enter your password' }
    }

    try {
      setLoading(true)

      const { data, status } = await clientApi.post('/api/auth/login', {
        email,
        password,
        rememberMe,
      })

      console.log('=== SessionProvider login ===')
      console.log('Login response:', data)
      console.log('Login status:', status)
      console.log('===\n')

      if (status === 200) {
        setUser(data.user)

        return { user: data.user }
      } else {
        return { error: data?.error || 'Login failed' }
      }
    } catch (err: any) {
      return { error: err?.response?.data?.error || 'Unexpected error' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, status } = await clientApi.get('/api/auth/session')

        if (status === 200 && data.user) {
          console.log('=== SessionProvider fetchSession ===')
          console.log('Session response:', data.user)
          console.log('Session status:', status)
          console.log('===\n')
          setUser(data.user)
        }
      } catch (error) {
        setUser(undefined)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  return (
    <SessionContext.Provider value={{ user, logout, login, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
