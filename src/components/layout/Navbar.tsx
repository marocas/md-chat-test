import { useSession } from '@/context/SessionContext'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ChatIcon from '@mui/icons-material/Chat'
import EventIcon from '@mui/icons-material/Event'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const navItems = [
  { title: 'Doctors', path: '/doctors', icon: <MedicalServicesIcon /> },
  { title: 'Search', path: '/search', icon: <SearchIcon /> },
  // { title: 'Appointments', path: '/appointments', icon: <EventIcon /> },
  { title: 'Chat', path: '/chat', icon: <ChatIcon /> },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { logout } = useSession()

  // Use our auth context
  const { user } = useSession()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      handleProfileMenuClose()
      enqueueSnackbar('Successfully logged out', { variant: 'success' })
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      enqueueSnackbar('Failed to log out', { variant: 'error' })
    }
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          MediChat
        </Typography>
      </Link>
      <Divider />
      <List>
        {navItems.map(item => (
          <ListItem key={item.path} disablePadding>
            <Link
              href={item.path}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {user ? (
          <>
            <ListItem disablePadding>
              <Link
                href="/profile"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link
                href="/medical-history"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <MedicalServicesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Medical History" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <Link
              href="/auth/login"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </Link>
          </ListItem>
        )}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              MediChat
            </Link>
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2 }}>
            {navItems.map(item => (
              <Button
                key={item.path}
                component={Link}
                startIcon={item.icon}
                href={item.path}
                sx={{ color: 'inherit' }}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={handleProfileMenuOpen}
              >
                <Avatar
                  alt={user?.firstName || 'User'}
                  src={user?.profileImage}
                  sx={{ width: 32, height: 32, ml: 1 }}
                />
                <Typography
                  sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  {user
                    ? `${user.name
                        .split(' ')
                        .map(n => n.charAt(0).toUpperCase())
                        .join('')}`
                    : 'User'}
                </Typography>
              </Box>
              <IconButton
                sx={{ display: { xs: 'flex', sm: 'none' } }}
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt={user?.firstName || 'User'}
                  src={user?.profileImage}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    handleProfileMenuClose()
                    router.push('/profile')
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleProfileMenuClose()
                    router.push('/medical-history')
                  }}
                >
                  <ListItemIcon>
                    <MedicalServicesIcon fontSize="small" />
                  </ListItemIcon>
                  Medical History
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleProfileMenuClose()
                    router.push('/appointments')
                  }}
                >
                  <ListItemIcon>
                    <EventIcon fontSize="small" />
                  </ListItemIcon>
                  My Appointments
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              href="/auth/login"
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  )
}
