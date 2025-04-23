import { AuthProvider } from '@/components/auth/AuthProvider'
import theme from '@/styles/theme'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <AuthProvider>{children}</AuthProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}
