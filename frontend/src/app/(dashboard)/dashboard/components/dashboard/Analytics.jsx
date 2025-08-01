'use client'

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Favorite as FavoriteIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Article as ArticleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'

const stats = [
  {
    name: 'Total Views',
    value: '12,458',
    change: '+12.5%',
    changeType: 'positive',
    icon: ViewIcon,
    color: '#1976d2',
  },
  {
    name: 'Total Likes',
    value: '1,429',
    change: '+8.2%',
    changeType: 'positive',
    icon: FavoriteIcon,
    color: '#d32f2f',
  },
  {
    name: 'Subscribers',
    value: '892',
    change: '+15.3%',
    changeType: 'positive',
    icon: PeopleIcon,
    color: '#2e7d32',
  },
  {
    name: 'Engagement Rate',
    value: '24.7%',
    change: '+2.1%',
    changeType: 'positive',
    icon: TrendingUpIcon,
    color: '#9c27b0',
  },
]

const topPosts = [
  { title: "Getting Started with Next.js 14", views: 3421, engagement: 32, trend: 'up' },
  { title: "Mastering Tailwind CSS", views: 2156, engagement: 28, trend: 'up' },
  { title: "React Best Practices", views: 1893, engagement: 25, trend: 'down' },
  { title: "TypeScript for Beginners", views: 1654, engagement: 22, trend: 'up' },
]

const recentActivity = [
  {
    type: 'view',
    message: 'Your post "Next.js 14 Guide" reached 1,000 views!',
    time: '2 hours ago',
    icon: ViewIcon,
    color: '#1976d2',
  },
  {
    type: 'like',
    message: '25 new likes on "Tailwind CSS Tips"',
    time: '5 hours ago',
    icon: FavoriteIcon,
    color: '#d32f2f',
  },
  {
    type: 'subscriber',
    message: '10 new subscribers this week',
    time: '1 day ago',
    icon: PeopleIcon,
    color: '#2e7d32',
  },
]

export default function Analytics() {
  const theme = useTheme()

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your blog performance and engagement metrics
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.name}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.name}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {stat.changeType === 'positive' ? (
                        <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                      <Typography
                        variant="body2"
                        color={stat.changeType === 'positive' ? 'success.main' : 'error.main'}
                        fontWeight="600"
                      >
                        {stat.change} from last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <stat.icon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Chart Placeholder */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Views Over Time
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 64, color: 'primary.main', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Chart Visualization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Integration with chart library needed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Posts */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Top Performing Posts
              </Typography>
              <Stack spacing={2}>
                {topPosts.map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {post.title}
                      </Typography>
                      {post.trend === 'up' ? (
                        <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {post.views} views
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={post.engagement}
                        sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2" fontWeight="600" color="primary.main">
                        {post.engagement}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      backgroundColor: alpha(activity.color, 0.05),
                      borderRadius: 2,
                      mb: 1,
                      border: `1px solid ${alpha(activity.color, 0.1)}`,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: activity.color }}>
                        <activity.icon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}