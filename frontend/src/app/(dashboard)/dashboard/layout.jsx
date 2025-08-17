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
      main: '#2563eb',
      contrastText: '#fff',
    },
    background: {
      default: '#f7f9fc',
      paper: '#fff',
    },
    text: {
      primary: '#22223b',
      secondary: '#6c6f7d',
    },
    divider: '#f1f1f1',
    grey: {
      100: '#f5f5f5',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 700, fontSize: '2.3rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '1.7rem', lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.35 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
    button: { fontWeight: 500, fontSize: '0.95rem', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: { background: '#f7f9fc', color: '#22223b' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(30,34,90,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          fontSize: '0.95rem',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          background: '#fff',
          boxShadow: '2px 0 24px 0 rgba(30,34,90,0.08)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 60,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

const DRAWER_WIDTH = 240

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  // Route-based tab
  const getCurrentTab = () => {
    if (pathname === '/dashboard') return 'dashboard'
    if (pathname.startsWith('/dashboard/guides')) return 'guides'
    if (pathname.startsWith('/dashboard/new/guide')) return 'editor'
    return 'dashboard'
  }

  const getPageTitle = () => {
    const tab = getCurrentTab()
    const titles = {
      dashboard: 'Dashboard',
      guides: 'Guides',
      addGuide: 'editor',
    }
    return titles[tab] || 'Dashboard'
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>
        <DashboardHeader 
          drawerWidth={DRAWER_WIDTH}
          handleDrawerToggle={handleDrawerToggle}
          pageTitle={getPageTitle()}
          currentUser="ADMIN"
        />
        <Sidebar
          drawerWidth={DRAWER_WIDTH}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          activeTab={getCurrentTab()}
          currentUser="ADMIN"
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            marginTop: { xs: '60px', sm: '60px' }, // Fixed header height
            height: { xs: 'calc(100vh - 60px)', sm: 'calc(100vh - 60px)' },
            backgroundColor: 'background.default',
            overflow: 'auto',
            position: 'relative',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': {
              background: '#e9ecef',
              borderRadius: 4,
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#e9ecef #f7f9fc',
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: '100%', width: '100%', maxWidth: '1280px', mx: 'auto' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}