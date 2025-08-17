'use client'

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import {
  Article as ArticleIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'My Guides', id: 'dashboard', icon: ArticleIcon, href: '/dashboard' },
  { name: 'Add', id: 'editor', icon: EditIcon, href: '/dashboard/new/guide' },
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

  const handleNavClick = (href) => {
    router.push(href)
    if (isMobile) handleDrawerToggle()
  }

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        px: 1,
        py: 2,
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        {navigation.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavClick(item.href)}
              selected={activeTab === item.id}
              sx={{
                borderRadius: 2,
                minHeight: 44,
                px: 2,
                transition: 'background 0.15s',
                backgroundColor: activeTab === item.id
                  ? alpha(theme.palette.primary.main, 0.09)
                  : 'transparent',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.15),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeTab === item.id
                    ? theme.palette.primary.main
                    : theme.palette.grey[600],
                  minWidth: 34,
                }}
              >
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: activeTab === item.id ? 600 : 500,
                  fontSize: '1rem',
                  color: activeTab === item.id
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto', mb: 0 }} />
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            maxWidth: '85vw',
            borderRight: `1px solid ${theme.palette.divider}`,
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
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}