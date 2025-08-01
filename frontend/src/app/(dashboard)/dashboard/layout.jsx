'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Sidebar from './components/dashboard/Sidebar'
import DashboardHeader from './components/dashboard/DashboardHeader'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontWeight: 600,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflow: 'hidden',
        },
        body: {
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            minHeight: 64,
            paddingLeft: 16,
            paddingRight: 16,
          },
          '@media (max-width: 599px)': {
            minHeight: 56,
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
})

const DRAWER_WIDTH = 260

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Enhanced route detection
  const getCurrentTab = () => {
    // Dashboard main page
    if (pathname === '/dashboard') return 'dashboard'
    
    // Blog related routes
    if (pathname === '/dashboard/blogs') return 'blogs'
    if (pathname === '/dashboard/new/blog') return 'editor'
    if (pathname.includes('/dashboard/editor')) return 'editor'
    
    // Analytics routes
    if (pathname === '/dashboard/analytics') return 'analytics'
    
    // Settings routes
    if (pathname === '/dashboard/settings') return 'settings'
    if (pathname.includes('/dashboard/settings/')) return 'settings'
    
    // Projects routes
    if (pathname === '/dashboard/projects') return 'projects'
    if (pathname.includes('/dashboard/projects/')) return 'projects'
    
    // Media routes
    if (pathname === '/dashboard/media') return 'media'
    if (pathname.includes('/dashboard/media/')) return 'media'
    
    // Profile routes
    if (pathname === '/dashboard/profile') return 'profile'
    if (pathname.includes('/dashboard/profile/')) return 'profile'
    
    // Default fallback
    return 'dashboard'
  }

  
  const getPageTitle = () => {
    const currentTab = getCurrentTab()
    const titles = {
      dashboard: '📊 Dashboard',
      blogs: '📝 Blog Posts',
      editor: '✍️ Blog Editor',
      analytics: '📈 Analytics',
      settings: '⚙️ Settings',
      projects: '🚀 Projects',
      media: '🖼️ Media Library',
      profile: '👤 Profile',
    }
    return titles[currentTab] || '📊 Dashboard'
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}>
        <DashboardHeader 
          drawerWidth={DRAWER_WIDTH}
          handleDrawerToggle={handleDrawerToggle}
          pageTitle={getPageTitle()}
          currentUser="Ratul-islam"
        />
        <Sidebar
          drawerWidth={DRAWER_WIDTH}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          activeTab={getCurrentTab()}
          currentUser="Ratul-islam"
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            marginTop: { xs: '56px', sm: '64px' }, // Fixed header height
            height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' }, // Full height minus header
            backgroundColor: 'background.default',
            overflow: 'auto', // Only this container should scroll
            position: 'relative',
            // Enhanced scrollbar styling - only for this container
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(180deg, #c1c1c1 0%, #a1a1a1 100%)',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                background: 'linear-gradient(180deg, #a1a1a1 0%, #808080 100%)',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 rgba(0,0,0,0.05)',
          }}
        >
          <Box sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: '100%', 
            width: '100%',
            maxWidth: '1400px',
            mx: 'auto',
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>

  )
}