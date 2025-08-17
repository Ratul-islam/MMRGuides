'use client'

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  CircularProgress,
  Alert,
  Pagination,
  Tooltip,
  Fade,
  Zoom,
  useMediaQuery,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import axios from "../../../../../lib/adminApi"
import { useRouter } from 'next/navigation'
import ConfirmationDialog from '../../../../../shared/dialogBox/confirmationBox.js'

export default function GuideList() {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Data state
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // UI state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    guide: null,
    loading: false,
  })
  const [refreshing, setRefreshing] = useState(false)

  // Helper function to get alpha values safely
  const getAlpha = (color, opacity) => {
    try {
      return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
    } catch {
      return `rgba(37, 99, 235, ${opacity})` // fallback to primary blue
    }
  }

  const fetchGuides = async (currentPage = 1, showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      const params = {
        page: currentPage,
        limit: 10,
      }
      const response = await axios.get('/guides', { params })
      if (response.data && Array.isArray(response.data.data)) {
        setGuides(response.data.data)
        setTotal(response.data.data.length)
        setTotalPages(1)
      } else if (response.data.success) {
        setGuides(response.data.data.guides || response.data.data.posts || [])
        setTotal(response.data.data.total || 0)
        setTotalPages(response.data.data.pages || 1)
      } else {
        setError('Failed to fetch guides')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching guides')
      console.error('Error fetching guides:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchGuides(page)
  }, [page])

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleNewGuide = () => {
    router.push('/dashboard/new/guide')
  }

  const handleEditGuide = (id) => {
    router.push(`/dashboard/guides/${id}/edit`)
  }

  const handleViewGuide = (link) => {
    if (!link) return
    window.open(link, '_blank')
  }

  const handleDeleteClick = (guide) => {
    setDeleteDialog({
      open: true,
      guide,
      loading: false,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.guide) return
    setDeleteDialog(prev => ({ ...prev, loading: true }))
    try {
      await axios.delete(`/guides/${deleteDialog.guide._id}`)
      setDeleteDialog({ open: false, guide: null, loading: false })
      fetchGuides(page, true)
    } catch (err) {
      console.error('Error deleting guide:', err)
      setError('Failed to delete guide')
      setDeleteDialog(prev => ({ ...prev, loading: false }))
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, guide: null, loading: false })
  }

  const handleRefresh = () => {
    fetchGuides(page, true)
  }

  if (loading && !refreshing) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        gap: 2,
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading your guides...
        </Typography>
      </Box>
    )
  }

  if (error && !refreshing) {
    return (
      <Fade in>
        <Box sx={{ mb: 4 }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Oops! Something went wrong
            </Typography>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: 2 }}
          >
            Try Again
          </Button>
        </Box>
      </Fade>
    )
  }

  return (
    <Box sx={{ height: '100%' }}>
      {/* Header Section */}
      <Card 
  sx={{ 
    mb: 4,
    borderRadius: 3,
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  }}
>
  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
    <Box sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'flex-start', sm: 'center' },
      gap: 2,
    }}>
      <Box>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>
          My Guides
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Manage your resource guides.
        </Typography>
        <Chip
          label={`${total} Guides`}
          size="small"
          color="primary"
          sx={{ fontWeight: 500, fontSize: '0.9rem', height: 24 }}
        />
      </Box>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Refresh">
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              background: 'transparent',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <RefreshIcon 
              sx={{ 
                fontSize: 20,
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                }
              }} 
            />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleNewGuide}
          sx={{
            borderRadius: 1.5,
            fontWeight: 500,
            px: 2,
            minWidth: 0,
            boxShadow: 'none',
            textTransform: 'none'
          }}
        >
          New Guide
        </Button>
      </Stack>
    </Box>
  </CardContent>
</Card>

      {/* Content */}
      {guides.length === 0 ? (
        <Zoom in>
  <Card sx={{ 
    textAlign: 'center',
    py: 6,
    borderRadius: 3,
    border: `1.5px dashed ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    boxShadow: 'none',
  }}>
    <CardContent>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" sx={{ opacity: 0.075, mb: 1, fontWeight: 700 }}>
          📚
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
          No guides found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Get started by adding your first guide.
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="medium"
        startIcon={<AddIcon />}
        onClick={handleNewGuide}
        sx={{
          borderRadius: 2,
          px: 3,
          boxShadow: 'none',
          fontWeight: 500,
          textTransform: 'none',
        }}
      >
        Add Guide
      </Button>
    </CardContent>
  </Card>
</Zoom>
      ) : (
        <>
          <Grid container spacing={3}>
            {guides.map((guide, index) => (
              <Grid item xs={12} key={guide._id}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: `1px solid ${getAlpha('#000000', 0.1)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 10px 20px ${getAlpha('#000000', 0.08)}`,
                        borderColor: getAlpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <CardContent sx={{ 
                      p: { xs: 3, md: 4 }, 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { md: 'center' },
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          sx={{
                            mb: 1,
                            cursor: guide.link ? 'pointer' : 'default',
                            color: guide.link ? theme.palette.primary.main : 'text.primary',
                            '&:hover': {
                              textDecoration: guide.link ? 'underline' : undefined,
                            }
                          }}
                          onClick={() => handleViewGuide(guide.link)}
                        >
                          {guide.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{
                            mb: 2,
                            lineHeight: 1.7,
                            fontSize: '1rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {guide.description}
                        </Typography>
                        {guide.link && (
                          <Chip
                            label="Visit"
                            icon={<LinkIcon />}
                            color="primary"
                            variant="outlined"
                            clickable
                            onClick={() => handleViewGuide(guide.link)}
                            sx={{ mr: 1, mb: 1 }}
                          />
                        )}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit Guide" placement="top">
                          <IconButton
                            color="success"
                            onClick={() => handleEditGuide(guide._id)}
                            sx={{
                              border: 1,
                              borderColor: getAlpha(theme.palette.success.main, 0.2),
                              '&:hover': { 
                                backgroundColor: getAlpha(theme.palette.success.main, 0.1),
                                borderColor: theme.palette.success.main,
                                transform: 'scale(1.1)',
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Guide" placement="top">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(guide)}
                            sx={{
                              border: 1,
                              borderColor: getAlpha(theme.palette.error.main, 0.2),
                              '&:hover': { 
                                backgroundColor: getAlpha(theme.palette.error.main, 0.1),
                                borderColor: theme.palette.error.main,
                                transform: 'scale(1.1)',
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 600,
                    }
                  }}
                />
              </Card>
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Guide"
        message={`Are you sure you want to delete "${deleteDialog.guide?.title}"? This action cannot be undone.`}
        confirmText="Delete Guide"
        cancelText="Keep Guide"
        variant="error"
        severity="high"
        loading={deleteDialog.loading}
        details={[
          'The guide will be permanently removed',
          'This action cannot be reversed'
        ]}
      />
    </Box>
  )
}