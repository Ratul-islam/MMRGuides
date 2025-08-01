'use client'

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  Divider,
  IconButton,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  CircularProgress,
  Fade,
  Skeleton,
  Tooltip,
} from '@mui/material'
import {
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Publish as PublishIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoIcon,
  Link as LinkIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useState, useEffect, useRef } from 'react'
import { alpha } from '@mui/material/styles'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '../../../../../lib/adminApi'
import RichTextEditor from '../../../../../shared/richtextEditor/richTextEditor.js'

export default function BlogEditor() {
  const theme = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const fileInputRef = useRef(null)

  const postSlug = searchParams.get('slug')
  const isEditing = Boolean(postSlug)

  const [title, setTitle] = useState('')
  const [postId, setPostId] = useState(null)
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [published, setPublished] = useState(false)
  
  // UI state
  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreviewDialog, setImagePreviewDialog] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })
  const [publishDialog, setPublishDialog] = useState(false)
  const [imageLoadError, setImageLoadError] = useState(false)

  const tagList = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
  const wordCount = content.replace(/<[^>]*>/g, '').split(' ').filter(Boolean).length
  const readTime = Math.ceil(wordCount / 200)

  useEffect(() => {
    if (isEditing && postSlug) {
      loadPost(postSlug)
    }
  }, [isEditing, postSlug])

  const loadPost = async (id) => {
    try {
      setLoading(true)
      const response = await api.get(`/posts/${id}`)
      
      if (response.data.success) {
        const post = response.data.data
        setPostId(post._id)
        setTitle(post.title)
        setContent(post.content)
        setExcerpt(post.excerpt || '')
        setTags(post.tags.join(', '))
        setFeaturedImage(post.featuredImage || '')
        setPublished(post.published)
      }
    } catch (error) {
      console.error('Error loading post:', error)
      setNotification({ 
        open: true, 
        message: 'Failed to load post', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Fixed Image upload functionality
  const handleImageUpload = async (file) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setNotification({
        open: true,
        message: 'Please upload a valid image file (JPEG, PNG, WebP, GIF)',
        severity: 'error'
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        open: true,
        message: 'Image size should be less than 5MB',
        severity: 'error'
      })
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      // Replace this with your actual image upload endpoint
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setFeaturedImage(response.data.data.url)
        setImageLoadError(false)
        setNotification({
          open: true,
          message: 'Image uploaded successfully!',
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to upload image',
        severity: 'error'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Fixed file select handler
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Fixed trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Remove featured image
  const removeFeaturedImage = () => {
    setFeaturedImage('')
    setImageLoadError(false)
    setNotification({
      open: true,
      message: 'Featured image removed',
      severity: 'info'
    })
  }

  const validateImageUrl = async (url) => {
    if (!url) {
      setImageLoadError(false)
      return
    }
    
    try {
      const img = new Image()
      img.onload = () => setImageLoadError(false)
      img.onerror = () => setImageLoadError(true)
      img.src = url
    } catch (error) {
      setImageLoadError(true)
    }
  }

  useEffect(() => {
    if (featuredImage) {
      validateImageUrl(featuredImage)
    } else {
      setImageLoadError(false)
    }
  }, [featuredImage])

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setNotification({ 
        open: true, 
        message: 'Title and content are required', 
        severity: 'warning' 
      })
      return
    }

    setSaving(true)
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        tags: tagList,
        featuredImage: featuredImage.trim() || null,
        published: false,
        slug: generateSlug(title)
      }

      let response
      if (isEditing) {
        response = await api.put(`/posts/${postId}`, postData)
      } else {
        response = await api.post('/posts', postData)
      }

      if (response.data.success) {
        setNotification({ 
          open: true, 
          message: isEditing ? 'Post updated successfully!' : 'Draft saved successfully!', 
          severity: 'success' 
        })
        
        if (!isEditing && response.data.data._id) {
          router.push(`/dashboard/editor?id=${response.data.data._id}`)
        }
      }
    } catch (error) {
      console.error('Error saving post:', error)
      setNotification({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to save post', 
        severity: 'error' 
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setNotification({ 
        open: true, 
        message: 'Title and content are required', 
        severity: 'warning' 
      })
      return
    }

    setPublishing(true)
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        tags: tagList,
        featuredImage: featuredImage.trim() || null,
        published: true,
        publishedAt: new Date().toISOString(),
        slug: generateSlug(title)
      }

      let response
      if (isEditing) {
        response = await api.put(`/posts/${postId}`, postData)
      } else {
        response = await api.post('/posts', postData)
      }

      if (response.data.success) {
        setPublished(true)
        setNotification({ 
          open: true, 
          message: 'Post published successfully!', 
          severity: 'success' 
        })
        setPublishDialog(false)
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Error publishing post:', error)
      setNotification({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to publish post', 
        severity: 'error' 
      })
    } finally {
      setPublishing(false)
    }
  }

  const generateExcerpt = () => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
    setExcerpt(excerpt)
  }

  const handleBack = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: '100%', height: '100%' }}>
        <Card sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={80} />
          </Box>
        </Card>
        <Card>
          <Box sx={{ p: 4 }}>
            <Skeleton variant="text" height={60} sx={{ mb: 3 }} />
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            </Grid>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: '100%', height: '100%' }}>
      {/* Enhanced Header */}
      <Card sx={{ mb: 3, overflow: 'visible', boxShadow: 3 }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            p: { xs: 2, sm: 3 },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', lg: 'center' },
            gap: 2,
            position: 'relative',
            zIndex: 1,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={handleBack}
                sx={{ 
                  color: 'white',
                  backgroundColor: alpha('#fff', 0.1),
                  '&:hover': { backgroundColor: alpha('#fff', 0.2) },
                  backdropFilter: 'blur(10px)',
                }}
              >
                <BackIcon />
              </IconButton>
              <Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
                  {isEditing ? 'Edit Post' : 'Create New Post'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {isEditing ? 'Update your existing content' : 'Write, preview, and publish your thoughts'}
                </Typography>
              </Box>
            </Box>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              sx={{ width: { xs: '100%', lg: 'auto' } }}
            >
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveDraft}
                disabled={saving || publishing || !title || !content}
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: alpha('#fff', 0.2),
                  backdropFilter: 'blur(10px)',
                  '&:hover': { backgroundColor: alpha('#fff', 0.3) },
                  '&:disabled': { backgroundColor: alpha('#fff', 0.1) },
                }}
              >
                {saving ? 'Saving...' : (isEditing ? 'Update Draft' : 'Save Draft')}
              </Button>
              
              <Button
                variant="contained"
                startIcon={<PublishIcon />}
                onClick={() => setPublishDialog(true)}
                disabled={!title || !content || publishing || saving}
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: published ? alpha('#4caf50', 0.9) : '#fff',
                  color: published ? 'white' : theme.palette.primary.main,
                  backdropFilter: 'blur(10px)',
                  '&:hover': { 
                    backgroundColor: published ? alpha('#4caf50', 1) : alpha('#fff', 0.9) 
                  },
                  fontWeight: 600,
                  boxShadow: 2,
                }}
              >
                {published ? 'Published' : 'Publish'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {(saving || publishing) && (
          <LinearProgress 
            sx={{ 
              height: 3,
              backgroundColor: alpha('#fff', 0.3),
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#fff',
              }
            }} 
          />
        )}
      </Card>

      <Card sx={{ boxShadow: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ px: 3 }}
            indicatorColor="primary"
          >
            <Tab 
              icon={<EditIcon />} 
              label="Editor" 
              iconPosition="start"
              sx={{ 
                minHeight: 'auto', 
                py: 2,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }
              }}
            />
            <Tab 
              icon={<PreviewIcon />} 
              label="Preview" 
              iconPosition="start"
              sx={{ 
                minHeight: 'auto', 
                py: 2,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }
              }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Fade in={currentTab === 0} timeout={300}>
            <Box sx={{ display: currentTab === 0 ? 'block' : 'none' }}>
              <Stack spacing={4}>
                {/* Enhanced Title */}
                <TextField
                  fullWidth
                  label="Post Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write an engaging title that captures attention..."
                  error={title.length > 200}
                  helperText={`${title.length}/200 characters`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '1.2rem', sm: '1.5rem' },
                      fontWeight: 600,
                      borderRadius: 2,
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                    },
                  }}
                />

                {/* Enhanced Metadata Row */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tags"
                      variant="outlined"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="react, nextjs, javascript, tutorial"
                      helperText="Separate tags with commas"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {/* Fixed Featured Image Upload */}
                    <Box>
                      <TextField
                        fullWidth
                        label="Featured Image URL"
                        variant="outlined"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="https://example.com/image.jpg or upload an image"
                        error={imageLoadError}
                        helperText={imageLoadError ? "Invalid image URL" : "Add a compelling featured image"}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Upload Image">
                                <IconButton 
                                  color="primary"
                                  onClick={triggerFileInput}
                                  disabled={uploadingImage}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                  }}
                                >
                                  {uploadingImage ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <PhotoIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                              {featuredImage && !imageLoadError && (
                                <Tooltip title="Preview Image">
                                  <IconButton 
                                    color="success"
                                    onClick={() => setImagePreviewDialog(true)}
                                    sx={{
                                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.success.main, 0.2),
                                      },
                                    }}
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {featuredImage && (
                                <Tooltip title="Remove Image">
                                  <IconButton 
                                    color="error"
                                    onClick={removeFeaturedImage}
                                    sx={{
                                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                                      },
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          ),
                        }}
                      />
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                        multiple={false}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Featured Image Preview */}
                {featuredImage && !imageLoadError && (
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Featured Image Preview:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<PreviewIcon />}
                          onClick={() => setImagePreviewDialog(true)}
                          sx={{ borderRadius: 2 }}
                        >
                          Full Size
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={removeFeaturedImage}
                          sx={{ borderRadius: 2 }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Box>
                    <Box
                      component="img"
                      src={featuredImage}
                      alt="Featured image preview"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => setImagePreviewDialog(true)}
                      onError={() => setImageLoadError(true)}
                    />
                  </Paper>
                )}

                {/* Show upload progress */}
                {uploadingImage && (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2">
                        Uploading image...
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Enhanced Excerpt */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Excerpt</Typography>
                    <Button 
                      size="small" 
                      onClick={generateExcerpt} 
                      disabled={!content}
                      startIcon={<EditIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Auto-generate
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Write a compelling summary of your post..."
                    error={excerpt.length > 500}
                    helperText={`${excerpt.length}/500 characters - This will appear in post previews`}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                {/* Enhanced Tags Preview */}
                {tagList.length > 0 && (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      Tags Preview:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {tagList.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          color="secondary"
                          variant="outlined"
                          size="small"
                          sx={{ 
                            borderRadius: 3,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Paper>
                )}

                {/* Publication Status */}
                {isEditing && (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: published 
                        ? alpha(theme.palette.success.main, 0.05)
                        : alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(
                        published ? theme.palette.success.main : theme.palette.warning.main, 
                        0.2
                      )}`,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={published}
                          onChange={(e) => setPublished(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: 600 }}>
                          {published ? "Published" : "Draft"}
                        </Typography>
                      }
                    />
                  </Paper>
                )}

                {/* Enhanced Rich Text Editor */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Content</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={`${wordCount} words`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        label={`${readTime} min read`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </Box>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing your amazing content here... Use the toolbar above to format your text!"
                      disabled={saving || publishing}
                    />
                  </Paper>
                </Box>
              </Stack>
            </Box>
          </Fade>

          <Fade in={currentTab === 1} timeout={300}>
            <Box sx={{ display: currentTab === 1 ? 'block' : 'none' }}>
              {/* Enhanced Preview */}
              <Box>
                {/* Preview Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  {featuredImage && !imageLoadError && (
                    <Box
                      component="img"
                      src={featuredImage}
                      alt={title}
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'cover',
                        borderRadius: 3,
                        mb: 3,
                        boxShadow: 3,
                      }}
                      onError={() => setImageLoadError(true)}
                    />
                  )}
                  
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" gutterBottom>
                    {title || 'Your Amazing Blog Title'}
                  </Typography>
                  
                  {excerpt && (
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 3, 
                        fontStyle: 'italic',
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.6,
                      }}
                    >
                      {excerpt}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}>
                      R
                    </Avatar>
                    <Typography variant="body1" color="text.secondary">
                      By Ratul Islam • {new Date().toLocaleDateString()} • {readTime} min read
                    </Typography>
                  </Box>
                  
                  {tagList.length > 0 && (
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                      {tagList.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          color="primary"
                          size="medium"
                          sx={{ 
                            borderRadius: 3,
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
                
                <Divider sx={{ mb: 4 }} />
                
                {/* Enhanced Preview Content */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 2, sm: 4 },
                    backgroundColor: 'transparent',
                  }}
                >
                  <Box
                    sx={{
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        fontWeight: 600,
                        marginTop: 3,
                        marginBottom: 2,
                        color: theme.palette.text.primary,
                      },
                      '& p': {
                        marginBottom: 2,
                        lineHeight: 1.8,
                        color: theme.palette.text.primary,
                      },
                      '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        boxShadow: 1,
                      },
                      '& blockquote': {
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        paddingLeft: 2,
                        marginLeft: 0,
                        fontStyle: 'italic',
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        padding: 2,
                        borderRadius: 1,
                      },
                      '& code': {
                        backgroundColor: alpha(theme.palette.grey[500], 0.1),
                        padding: '2px 8px',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                      },
                      '& pre': {
                        backgroundColor: alpha(theme.palette.grey[500], 0.05),
                        padding: 2,
                        borderRadius: 2,
                        overflow: 'auto',
                      },
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      maxWidth: 'none',
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: content || '<p style="color: #999; font-style: italic; text-align: center; padding: 60px 20px;">Your content will appear here...</p>' 
                    }}
                  />
                </Paper>
              </Box>
            </Box>
          </Fade>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog 
        open={imagePreviewDialog} 
        onClose={() => setImagePreviewDialog(false)} 
        maxWidth="lg" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Featured Image Preview</Typography>
          <IconButton onClick={() => setImagePreviewDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {featuredImage && (
            <Box
              component="img"
              src={featuredImage}
              alt="Featured image preview"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={removeFeaturedImage} color="error" startIcon={<DeleteIcon />}>
            Remove Image
          </Button>
          <Button onClick={() => setImagePreviewDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Publish Dialog */}
      <Dialog open={publishDialog} onClose={() => setPublishDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <PublishIcon />
            </Avatar>
            <Typography variant="h6">
              {isEditing && published ? 'Update Published Post?' : 'Ready to Publish?'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography gutterBottom>
            {isEditing && published 
              ? 'Your changes will be updated in the published post.'
              : 'Your post is ready to be published. Here\'s what will happen:'
            }
          </Typography>
          {!(isEditing && published) && (
            <Box component="ul" sx={{ pl: 2, mt: 2, mb: 2 }}>
              <li>Your post will be visible to all readers</li>
              <li>It will appear in the blog feed</li>
              <li>Social media previews will be generated</li>
              <li>A publish timestamp will be recorded</li>
            </Box>
          )}
          {(!excerpt || tagList.length === 0) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Consider adding {!excerpt ? 'an excerpt' : ''}{!excerpt && tagList.length === 0 ? ' and ' : ''}{tagList.length === 0 ? 'tags' : ''} for better SEO and discoverability.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPublishDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePublish}
            disabled={publishing}
            startIcon={publishing ? <CircularProgress size={16} color="inherit" /> : <PublishIcon />}
            sx={{ borderRadius: 2 }}
          >
            {publishing ? 'Publishing...' : (isEditing && published ? 'Update Post' : 'Publish Now')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}