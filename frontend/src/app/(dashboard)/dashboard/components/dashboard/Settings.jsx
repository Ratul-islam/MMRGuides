'use client'

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Grid,
  Stack,
  Divider,
  Chip,
  useTheme,
} from '@mui/material'
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'

const colorThemes = [
  { name: 'Blue', color: '#1976d2' },
  { name: 'Purple', color: '#9c27b0' },
  { name: 'Green', color: '#2e7d32' },
  { name: 'Orange', color: '#f57c00' },
  { name: 'Red', color: '#d32f2f' },
]

export default function Settings() {
  const theme = useTheme()

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account and blog preferences
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Profile Settings */}
        <Card>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon />
              <Typography variant="h6" fontWeight="bold">
                Profile Settings
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Button
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        right: -8,
                        minWidth: 'auto',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                    >
                      <PhotoCameraIcon sx={{ fontSize: 16 }} />
                    </Button>
                  </Box>
                  <Box>
                    <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                      Change Picture
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  defaultValue="Admin"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
              color: 'white',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationsIcon />
              <Typography variant="h6" fontWeight="bold">
                Notification Preferences
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              {[
                { label: "Email notifications for new comments", checked: true },
                { label: "Email notifications for new likes", checked: false },
                { label: "Weekly analytics summary", checked: true },
                { label: "New subscriber notifications", checked: true },
                { label: "Marketing emails", checked: false }
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <FormControlLabel
                    control={<Switch defaultChecked={item.checked} color="primary" />}
                    label={item.label}
                    sx={{ width: '100%', justifyContent: 'space-between', ml: 0, mr: 0 }}
                    labelPlacement="start"
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Blog Customization */}
        <Card>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.error.main} 100%)`,
              color: 'white',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PaletteIcon />
              <Typography variant="h6" fontWeight="bold">
                Blog Customization
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Blog Title"
                  defaultValue="Ratul's Tech Blog"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Blog URL"
                  defaultValue="ratul-tech-blog"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Theme Color
                </Typography>
                <Stack direction="row" spacing={2}>
                  {colorThemes.map((colorTheme, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: colorTheme.color,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: index === 0 ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: `0 4px 20px ${alpha(colorTheme.color, 0.4)}`,
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
              color: 'white',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SecurityIcon />
              <Typography variant="h6" fontWeight="bold">
                Security Settings
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Add an extra layer of security to your account
                  </Typography>
                  <Button variant="outlined" color="success" size="small">
                    Enable 2FA
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              px: 4,
              py: 1.5,
              borderRadius: 3,
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}