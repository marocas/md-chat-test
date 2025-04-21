import { getCurrentUser, User } from '@/data/mock/users'
import {
  AuthState,
  clearAuthState,
  getAuthState,
  setAuthState,
} from '@/services/authService'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthContextType {
  authState: AuthState
  currentUser: User | null
  setAuthState: (auth: AuthState) => void
  clearAuthState: () => void
  isLoading: boolean
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  authState: { isAuthenticated: false },
  currentUser: null,
  setAuthState: () => {},
  clearAuthState: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthStateLocal] = useState<AuthState>({
    isAuthenticated: false,
  })
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after the component mounts
  // This ensures we only access browser APIs after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize auth state from local storage on mount
  useEffect(() => {
    if (!isClient) return // Skip on server-side rendering

    const initAuth = async () => {
      try {
        const state = getAuthState()
        setAuthStateLocal(state)

        if (state.isAuthenticated && state.userId) {
          // In a real app, you would fetch the user data from an API
          // For mock purposes, we'll use our mock user data
          const user = await getCurrentUser()
          setCurrentUser(user)
        } else {
          setCurrentUser(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [isClient])

  // Listen for auth change events (from other tabs/windows)
  useEffect(() => {
    if (!isClient) return // Skip on server-side rendering

    const handleAuthChange = async () => {
      const state = getAuthState()
      setAuthStateLocal(state)

      if (state.isAuthenticated && state.userId) {
        setCurrentUser(await getCurrentUser())
      } else {
        setCurrentUser(null)
      }
    }

    // Listen for the custom event we dispatch in our auth service
    window.addEventListener('auth-change', handleAuthChange)
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [isClient])

  // Update auth state in localStorage and component state
  const handleSetAuthState = async (auth: AuthState) => {
    if (isClient) {
      setAuthState(auth)
    }
    setAuthStateLocal(auth)

    // Update current user
    if (auth.isAuthenticated && auth.userId) {
      setCurrentUser(await getCurrentUser())
    } else {
      setCurrentUser(null)
    }
  }

  // Clear auth state in localStorage and component state
  const handleClearAuthState = () => {
    if (isClient) {
      clearAuthState()
    }
    setAuthStateLocal({ isAuthenticated: false })
    setCurrentUser(null)
  }

  const value = {
    authState,
    currentUser,
    setAuthState: handleSetAuthState,
    clearAuthState: handleClearAuthState,
    isLoading: !isClient || isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
