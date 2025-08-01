'use client'

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  Article as ArticleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
const navigation = [
  { name: 'My Blogs', id: 'dashboard', icon: ArticleIcon, href: '/dashboard' },
  { name: 'Write Blog', id: 'editor', icon: EditIcon, href: '/dashboard/new/blog' },
]

export default function Sidebar({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  activeTab,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

  const handleNavClick = (hreftring) => {
    router.push(hreftring)
    if (isMobile) {
      handleDrawerToggle()
    }
  }

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      width: '100%',
    }}>

      <Divider sx={{ flexShrink: 0 }} />

      <List sx={{ 
        flexGrow: 1, 
        px: 1, 
        py: 1,
        overflow: 'auto',
      }}>
        {navigation.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavClick(item.href)}
              sx={{
                borderRadius: 2,
                mx: 1,
                minHeight: 44,
                background: activeTab === item.id 
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                  : 'transparent',
                color: activeTab === item.id ? 'white' : 'inherit',
                '&:hover': {
                  background: activeTab === item.id
                    ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
                    : alpha(theme.palette.primary.main, 0.08),
                },
                transition: 'all 0.2s ease-in-out',
                transform: activeTab === item.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === item.id ? 'white' : theme.palette.primary.main,
                  minWidth: 36,
                }}
              >
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: activeTab === item.id ? 600 : 500,
                  fontSize: '0.9rem',
                  noWrap: true,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ 
        p: 1.5, 
        textAlign: 'center', 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        flexShrink: 0,
      }}>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
        zIndex: theme.zIndex.drawer,
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            maxWidth: '85vw',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}