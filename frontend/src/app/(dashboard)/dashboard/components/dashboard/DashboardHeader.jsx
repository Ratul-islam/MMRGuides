'use client'

import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExitToApp as ExitIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardHeader({
  drawerWidth,
  handleDrawerToggle,
  pageTitle = "📊 Dashboard",
  currentUser = "Admin"
}) {
  const theme = useTheme()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [logoutDialog, setLogoutDialog] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogoutClick = () => {
    setAnchorEl(null)
    setLogoutDialog(true)
  }

  const handleLogoutCancel = () => {
    setLogoutDialog(false)
  }

  const clearAllStorageAndCookies = () => {
    try {
      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Clear all cookies
      const cookies = document.cookie.split(";")
      
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        
        // Clear cookie for current domain
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        
        // Clear cookie for current domain with leading dot
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        
        // Clear cookie for parent domain
        const domain = window.location.hostname.split('.').slice(-2).join('.')
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`
      }
      
      const authCookieNames = [
        'token',
        'auth_token', 
        'access_token',
        'refresh_token',
        'session_id',
        'jwt',
        'authToken',
        'user_session',
        'login_token'
      ]
      
      authCookieNames.forEach(cookieName => {
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        const domain = window.location.hostname.split('.').slice(-2).join('.')
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`
      })
      
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  const handleLogoutConfirm = async () => {
    setLoggingOut(true)
    
    try {
      // Optional: Call logout API endpoint
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
      } catch (apiError) {
        console.warn('Logout API call failed:', apiError)
        // Continue with logout even if API fails
      }
      
      // Clear all storage and cookies
      clearAllStorageAndCookies()
      
      // Close dialog
      setLogoutDialog(false)
      
      // Small delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to login page
      window.location.href = '/login' // Use window.location for complete page refresh
      
    } catch (error) {
      console.error('Logout error:', error)
      
      // Even if there's an error, clear storage and redirect
      clearAllStorageAndCookies()
      setLogoutDialog(false)
      window.location.href = '/login'
    }
  }

  const handleProfileClick = () => {
    setAnchorEl(null)
    router.push('/dashboard/profile')
  }

  const handleSettingsClick = () => {
    setAnchorEl(null)
    router.push('/dashboard/settings')
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          color: 'text.primary',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' },
                border: 1,
                borderColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Page Title */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {pageTitle}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime()} • {new Date().toLocaleDateString()}
              </Typography>
            </Box>

          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ 
                ml: 1,
                border: 1,
                borderColor: alpha(theme.palette.divider, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 8,
              sx: {
                borderRadius: 3,
                mt: 1.5,
                minWidth: 240,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s ease',
                }
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  A
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    Admin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admin Dashboard
                  </Typography>
                </Box>
              </Box>
            </Box>

            
            <MenuItem 
              onClick={handleLogoutClick}
              sx={{ 
                color: 'error.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                }
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={handleLogoutCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: 'warning.main',
              }}
            >
              <ExitIcon />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              Sign Out Confirmation
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to sign out? This will:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>
              <Typography variant="body2" color="text.secondary">
                Clear all your session data and authentication tokens
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Remove any saved preferences and cache
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Redirect you to the login page
              </Typography>
            </li>
          </Box>
          <Typography variant="body2" color="text.secondary">
            You'll need to log in again to access your dashboard.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            disabled={loggingOut}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="warning"
            disabled={loggingOut}
            startIcon={loggingOut ? null : <LogoutIcon />}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            {loggingOut ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}