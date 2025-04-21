import { getCurrentUser, User } from '@/data/mock/users'

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
}

// Authentication state for local storage
export interface AuthState {
  isAuthenticated: boolean
  userId?: string
  userRole?: 'patient' | 'doctor' | 'admin'
  expires?: number // Timestamp when the session expires
}

// Auth state management
const AUTH_STORAGE_KEY = 'medichat_auth'

// Helper to check if code is running on client side
const isClient = typeof window !== 'undefined'

/**
 * Get the current authentication state from localStorage
 */
export const getAuthState = (): AuthState => {
  // Check for server-side rendering
  if (!isClient) {
    return { isAuthenticated: false }
  }

  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!storedAuth) {
      return { isAuthenticated: false }
    }

    const auth: AuthState = JSON.parse(storedAuth)

    // Check if session has expired
    if (auth.expires && auth.expires < Date.now()) {
      clearAuthState()
      return { isAuthenticated: false }
    }

    return auth
  } catch (error) {
    console.error('Error reading auth state:', error)
    return { isAuthenticated: false }
  }
}

/**
 * Save authentication state to localStorage
 */
export const setAuthState = (auth: AuthState): void => {
  if (!isClient) return

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    // Trigger an event so other components can react to auth changes
    window.dispatchEvent(new Event('auth-change'))
  } catch (error) {
    console.error('Error saving auth state:', error)
  }
}

/**
 * Clear authentication state from localStorage
 */
export const clearAuthState = (): void => {
  if (!isClient) return

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    // Trigger an event so other components can react to auth changes
    window.dispatchEvent(new Event('auth-change'))
  } catch (error) {
    console.error('Error clearing auth state:', error)
  }
}

/**
 * Sign in with email/password or social provider
 * This is a mock implementation that would normally call an API
 */
export const signIn = async (
  email?: string | null,
  password?: string | null,
  rememberMe: boolean = false,
  provider?: string
): Promise<AuthResult> => {
  // In a real app, you would validate credentials with your backend
  // For our mock, we'll just simulate a successful login with a mock user

  try {
    // Get the first user from the mock data
    const mockUser = await getCurrentUser()

    // For social login, just simulate success
    if (provider) {
      // In a real app, this would redirect to the provider's OAuth flow
      console.log(`Simulating ${provider} login`)
    }

    // For email/password login, do basic validation
    if (email && password) {
      // In a real app, check credentials against the backend
      if (false && email !== mockUser.email) {
        return {
          success: false,
          error: 'User not found',
        }
      }

      // Simulate password check (in reality, this would be done server-side)
      if (password !== 'Pa$$w0rd!') {
        return {
          success: false,
          error: 'Invalid password',
        }
      }
    }

    // Calculate expiration time (30 days if remember me, 1 day otherwise)
    const expirationDays = rememberMe ? 30 : 1
    const expires = Date.now() + expirationDays * 24 * 60 * 60 * 1000

    // Set auth state in local storage
    setAuthState({
      isAuthenticated: true,
      userId: mockUser.id,
      userRole: 'patient', // In a real app, this would come from the user data
      expires,
    })

    const result = {
      success: true,
      user: mockUser,
    }
    console.log('\n=== Sign-in Result ===')
    console.log(result)
    console.log('===\n')

    return result
  } catch (error) {
    console.error('Sign-in error:', error)
    return {
      success: false,
      error: 'Authentication failed',
    }
  }
}

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  // In a real app, you might need to call an API to invalidate tokens
  clearAuthState()
}

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const auth = getAuthState()
  return auth.isAuthenticated
}

/**
 * Get the current user's ID
 */
export const getCurrentUserId = (): string | undefined => {
  const auth = getAuthState()
  return auth.userId
}

/**
 * Register a new user
 * This is a mock implementation that would normally call an API
 */
export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResult> => {
  // In a real app, you would call your API to create a new user
  // For our mock, we'll just simulate a successful registration

  try {
    // Simulate server-side validation
    if (!email || !password || !firstName || !lastName) {
      return {
        success: false,
        error: 'All fields are required',
      }
    }

    // Check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
      }
    }

    // Check for password strength
    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters',
      }
    }

    // In a real app, check if the email is already in use

    // Simulate successful registration
    console.log('Registered user:', { email, firstName, lastName })

    // In a real app, the user object would come from the server response
    const mockUser = {
      id: 'new_user_' + Date.now(),
      firstName,
      lastName,
      email,
      // other fields would be set by the server
    }

    // Set auth state in local storage - auto-login after registration
    setAuthState({
      isAuthenticated: true,
      userId: mockUser.id,
      userRole: 'patient',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day expiration
    })

    return {
      success: true,
      user: mockUser as User,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Registration failed',
    }
  }
}

/**
 * Update the current user's profile
 */
export const updateProfile = async (
  userData: Partial<User>
): Promise<AuthResult> => {
  // In a real app, you would call your API to update the user
  // For our mock, we'll just simulate a successful update

  try {
    const currentAuth = getAuthState()
    if (!currentAuth.isAuthenticated || !currentAuth.userId) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // In a real app, this would be a PUT/PATCH request to your API
    console.log('Updating user profile:', userData)

    return {
      success: true,
      // In a real app, the updated user would come from the server response
      user: {
        ...getCurrentUser(),
        ...userData,
      },
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return {
      success: false,
      error: 'Update failed',
    }
  }
}
