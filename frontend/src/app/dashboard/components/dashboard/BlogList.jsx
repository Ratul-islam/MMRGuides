// 'use client'

// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Chip,
//   IconButton,
//   Stack,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   useTheme,
//   CircularProgress,
//   Alert,
//   Pagination,
//   CardMedia,
//   Tooltip,
//   Fade,
//   Zoom,
//   useMediaQuery,
// } from '@mui/material'
// import {
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   CalendarToday as CalendarIcon,
//   Public as PublicIcon,
//   Article as DraftIcon,
//   TrendingUp as TrendingIcon,
//   FilterList as FilterIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material'
// import { useState, useEffect } from 'react'
// import axios from "../../../../lib/adminApi"
// import { useRouter } from 'next/navigation'
// import ConfirmationDialog from '../../../../shared/dialogBox/confirmationBox.js'


// export default function BlogList() {
//   const theme = useTheme()
//   const router = useRouter()
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
//   // Data state
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filter, setFilter] = useState('all')
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [total, setTotal] = useState(0)
  
//   // UI state
//   const [deleteDialog, setDeleteDialog] = useState({
//     open: false,
//     post: null,
//     loading: false,
//   })
//   const [refreshing, setRefreshing] = useState(false)

//   // Helper function to get alpha values safely
//   const getAlpha = (color, opacity) => {
//     try {
//       return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`
//     } catch {
//       return `rgba(25, 118, 210, ${opacity})` 
//     }
//   }

//   const fetchPosts = async (currentPage = 1, currentFilter = 'all', showRefresh = false) => {
//     try {
//       if (showRefresh) {
//         setRefreshing(true)
//       } else {
//         setLoading(true)
//       }
//       setError(null)
      
//       const params = {
//         page: currentPage,
//         limit: 10,
//       }
      
//       if (currentFilter === 'published') {
//         params.published = true
//       } else if (currentFilter === 'draft') {
//         params.published = false
//       }

//       const response = await axios.get('/posts', { params })
      
//       if (response.data.success) {
//         setPosts(response.data.data.posts)
//         setTotalPages(response.data.data.pages)
//         setTotal(response.data.data.total)
//       } else {
//         setError('Failed to fetch posts')
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while fetching posts')
//       console.error('Error fetching posts:', err)
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   useEffect(() => {
//     fetchPosts(page, filter)
//   }, [page, filter])

//   const handleFilterChange = (newFilter) => {
//     setFilter(newFilter)
//     setPage(1)
//   }

//   const handlePageChange = (event, value) => {
//     setPage(value)
//   }

//   const handleNewPost = () => {
//     router.push('/dashboard/new/blog')
//   }

//   const handleEditPost = (slug) => {
//     router.push(`/dashboard/editor?slug=${slug}`)
//   }

//   const handleViewPost = (slug) => {
//     window.open(`/blog/${slug}`, '_blank')
//   }

//   const handleDeleteClick = (post) => {
//     setDeleteDialog({
//       open: true,
//       post: post,
//       loading: false,
//     })
//   }

//   const handleDeleteConfirm = async () => {
//     if (!deleteDialog.post) return
    
//     setDeleteDialog(prev => ({ ...prev, loading: true }))
    
//     try {
//       await axios.delete(`/posts/${deleteDialog.post._id}`)
      
//       // Close dialog and refresh list
//       setDeleteDialog({ open: false, post: null, loading: false })
//       fetchPosts(page, filter, true)
      
//     } catch (err) {
//       console.error('Error deleting post:', err)
//       setError('Failed to delete post')
//       setDeleteDialog(prev => ({ ...prev, loading: false }))
//     }
//   }

//   const handleDeleteCancel = () => {
//     setDeleteDialog({ open: false, post: null, loading: false })
//   }

//   const handleRefresh = () => {
//     fetchPosts(page, filter, true)
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   const getReadTime = (content) => {
//     const wordsPerMinute = 200
//     const wordCount = content.split(' ').length
//     const readTime = Math.ceil(wordCount / wordsPerMinute)
//     return `${readTime} min read`
//   }

//   const getFilterStats = () => {
//     const published = posts.filter(post => post.published).length
//     const drafts = posts.filter(post => !post.published).length
//     return { published, drafts, total: posts.length }
//   }

//   const stats = getFilterStats()

//   if (loading && !refreshing) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         flexDirection: 'column',
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '60vh',
//         gap: 2,
//       }}>
//         <CircularProgress size={60} thickness={4} />
//         <Typography variant="body1" color="text.secondary">
//           Loading your amazing content...
//         </Typography>
//       </Box>
//     )
//   }

//   if (error && !refreshing) {
//     return (
//       <Fade in>
//         <Box sx={{ mb: 4 }}>
//           <Alert 
//             severity="error" 
//             sx={{ 
//               mb: 2,
//               borderRadius: 3,
//               boxShadow: 2,
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               Oops! Something went wrong
//             </Typography>
//             {error}
//           </Alert>
//           <Button 
//             variant="contained" 
//             onClick={() => fetchPosts(page, filter)}
//             startIcon={<RefreshIcon />}
//             sx={{ borderRadius: 2 }}
//           >
//             Try Again
//           </Button>
//         </Box>
//       </Fade>
//     )
//   }

//   return (
//     <Box sx={{ height: '100%' }}>
//       {/* Header Section */}
//       <Card 
//         sx={{ 
//           mb: 4, 
//           borderRadius: 4,
//           background: `linear-gradient(135deg, ${getAlpha(theme.palette.primary.main, 0.1)} 0%, ${getAlpha(theme.palette.secondary.main, 0.1)} 100%)`,
//           border: `1px solid ${getAlpha(theme.palette.primary.main, 0.1)}`,
//         }}
//       >
//         <CardContent sx={{ p: { xs: 3, md: 4 } }}>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', lg: 'row' },
//             justifyContent: 'space-between', 
//             alignItems: { xs: 'flex-start', lg: 'center' },
//             gap: 3,
//           }}>
//             <Box>
//               <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
//                 📝 My Blog Posts
//               </Typography>
//               <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//                 Manage and track your published content
//               </Typography>
              
//               {/* Stats */}
//               <Stack direction="row" spacing={2} flexWrap="wrap">
//                 <Chip
//                   label={`${total} Total`}
//                   color="primary"
//                   variant="outlined"
//                   sx={{ fontWeight: 600 }}
//                 />
//                 <Chip
//                   label={`${stats.published} Published`}
//                   color="success"
//                   variant="outlined"
//                   sx={{ fontWeight: 600 }}
//                 />
//                 <Chip
//                   label={`${stats.drafts} Drafts`}
//                   color="warning"
//                   variant="outlined"
//                   sx={{ fontWeight: 600 }}
//                 />
//               </Stack>
//             </Box>
            
//             <Stack 
//               direction={{ xs: 'column', sm: 'row' }} 
//               spacing={2}
//               sx={{ width: { xs: '100%', lg: 'auto' } }}
//             >
//               <FormControl size="small" sx={{ minWidth: 140 }}>
//                 <InputLabel>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                     <FilterIcon fontSize="small" />
//                     Filter
//                   </Box>
//                 </InputLabel>
//                 <Select 
//                   value={filter} 
//                   label="Filter"
//                   onChange={(e) => handleFilterChange(e.target.value)}
//                   sx={{ borderRadius: 2 }}
//                 >
//                   <MenuItem value="all">📋 All Posts</MenuItem>
//                   <MenuItem value="published">🌐 Published</MenuItem>
//                   <MenuItem value="draft">📝 Drafts</MenuItem>
//                 </Select>
//               </FormControl>
              
//               <Tooltip title="Refresh Posts">
//                 <IconButton
//                   onClick={handleRefresh}
//                   disabled={refreshing}
//                   sx={{
//                     border: 1,
//                     borderColor: 'divider',
//                     borderRadius: 2,
//                     '&:hover': {
//                       borderColor: theme.palette.primary.main,
//                       backgroundColor: getAlpha(theme.palette.primary.main, 0.1),
//                     }
//                   }}
//                 >
//                   <RefreshIcon 
//                     sx={{ 
//                       animation: refreshing ? 'spin 1s linear infinite' : 'none',
//                       '@keyframes spin': {
//                         '0%': { transform: 'rotate(0deg)' },
//                         '100%': { transform: 'rotate(360deg)' },
//                       }
//                     }} 
//                   />
//                 </IconButton>
//               </Tooltip>
              
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleNewPost}
//                 sx={{
//                   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                   borderRadius: 2,
//                   fontWeight: 600,
//                   px: 3,
//                   '&:hover': {
//                     transform: 'translateY(-1px)',
//                     boxShadow: 4,
//                   }
//                 }}
//               >
//                 ✨ New Post
//               </Button>
//             </Stack>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Content */}
//       {posts.length === 0 ? (
//         <Zoom in>
//           <Card sx={{ 
//             textAlign: 'center', 
//             py: 8,
//             borderRadius: 4,
//             border: `2px dashed ${getAlpha(theme.palette.primary.main, 0.2)}`,
//             background: getAlpha(theme.palette.primary.main, 0.02),
//           }}>
//             <CardContent>
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="h2" sx={{ opacity: 0.1, mb: 2 }}>
//                   📝
//                 </Typography>
//                 <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="bold">
//                   {filter === 'all' ? 'No posts found' : `No ${filter} posts found`}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//                   {filter === 'all' 
//                     ? 'Ready to share your thoughts with the world? Create your first blog post!' 
//                     : `Try changing the filter or create a new ${filter === 'published' ? 'published' : 'draft'} post.`
//                   }
//                 </Typography>
//               </Box>
              
//               <Button
//                 variant="contained"
//                 size="large"
//                 startIcon={<AddIcon />}
//                 onClick={handleNewPost}
//                 sx={{
//                   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                   borderRadius: 3,
//                   px: 4,
//                   py: 1.5,
//                   fontWeight: 600,
//                 }}
//               >
//                 🚀 Create Your First Post
//               </Button>
//             </CardContent>
//           </Card>
//         </Zoom>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {posts.map((post, index) => (
//               <Grid item xs={12} key={post._id}>
//                 <Fade in timeout={300 + index * 100}>
//                   <Card
//                     sx={{
//                       borderRadius: 4,
//                       border: `1px solid ${getAlpha('#000000', 0.1)}`,
//                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: `0 20px 40px ${getAlpha('#000000', 0.1)}`,
//                         borderColor: getAlpha(theme.palette.primary.main, 0.3),
//                       },
//                     }}
//                   >
//                     <Box sx={{ 
//                       display: 'flex', 
//                       flexDirection: { xs: 'column', md: 'row' },
//                       minHeight: { xs: 'auto', md: 200 }
//                     }}>
//                       {/* Featured Image */}
//                       {post.featuredImage && (
//                         <CardMedia
//                           component="img"
//                           sx={{ 
//                             width: { xs: '100%', md: 280 },
//                             height: { xs: 200, md: 200 },
//                             objectFit: 'cover',
//                             borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
//                             cursor: 'pointer',
//                             transition: 'transform 0.3s ease',
//                             '&:hover': {
//                               transform: 'scale(1.05)',
//                             }
//                           }}
//                           image={post.featuredImage}
//                           alt={post.title}
//                           onClick={() => handleViewPost(post.slug)}
//                         />
//                       )}
                      
//                       {/* Content */}
//                       <CardContent sx={{ 
//                         flex: 1, 
//                         p: { xs: 3, md: 4 }, 
//                         display: 'flex', 
//                         flexDirection: 'column',
//                         justifyContent: 'space-between',
//                       }}>
//                         <Box>
//                           <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
//                             <Box sx={{ flex: 1, mr: 2 }}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
//                                 <Typography 
//                                   variant="h5" 
//                                   fontWeight="bold" 
//                                   sx={{ 
//                                     cursor: 'pointer', 
//                                     '&:hover': { 
//                                       color: theme.palette.primary.main,
//                                       textDecoration: 'underline',
//                                     },
//                                     lineHeight: 1.3,
//                                   }}
//                                   onClick={() => handleViewPost(post.slug)}
//                                 >
//                                   {post.title}
//                                 </Typography>
//                                 <Chip
//                                   icon={post.published ? <PublicIcon /> : <DraftIcon />}
//                                   label={post.published ? '🌐 Published' : '📝 Draft'}
//                                   color={post.published ? 'success' : 'warning'}
//                                   size="small"
//                                   sx={{ 
//                                     fontWeight: 600,
//                                     borderRadius: 2,
//                                   }}
//                                 />
//                               </Box>
                              
//                               <Typography 
//                                 variant="body1" 
//                                 color="text.secondary" 
//                                 sx={{ 
//                                   mb: 3, 
//                                   lineHeight: 1.7,
//                                   fontSize: '1rem',
//                                   overflow: 'hidden',
//                                   textOverflow: 'ellipsis',
//                                   display: '-webkit-box',
//                                   WebkitLineClamp: 2,
//                                   WebkitBoxOrient: 'vertical',
//                                 }}
//                               >
//                                 {post.excerpt}
//                               </Typography>

//                               <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap' }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                   <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
//                                   <Typography variant="body2" color="text.secondary" fontWeight="500">
//                                     {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
//                                   </Typography>
//                                 </Box>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                   <TrendingIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
//                                   <Typography variant="body2" color="text.secondary" fontWeight="500">
//                                     {post.views} views
//                                   </Typography>
//                                 </Box>
//                                 <Typography variant="body2" color="text.secondary" fontWeight="500">
//                                   ⏱️ {getReadTime(post.content)}
//                                 </Typography>
//                               </Stack>

//                               <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                                 {post.tags.slice(0, 3).map((tag, index) => (
//                                   <Chip
//                                     key={index}
//                                     label={`#${tag}`}
//                                     size="small"
//                                     variant="outlined"
//                                     color="primary"
//                                     sx={{ 
//                                       borderRadius: 2,
//                                       '&:hover': {
//                                         backgroundColor: getAlpha(theme.palette.primary.main, 0.1),
//                                       }
//                                     }}
//                                   />
//                                 ))}
//                                 {post.tags.length > 3 && (
//                                   <Chip
//                                     label={`+${post.tags.length - 3} more`}
//                                     size="small"
//                                     variant="filled"
//                                     color="default"
//                                     sx={{ borderRadius: 2 }}
//                                   />
//                                 )}
//                               </Stack>
//                             </Box>

//                             {/* Action Buttons */}
//                             <Stack direction={{ xs: 'row', md: 'column' }} spacing={1}>
//                               <Tooltip title="View Post" placement="top">
//                                 <IconButton
//                                   color="primary"
//                                   onClick={() => handleViewPost(post.slug)}
//                                   sx={{
//                                     border: 1,
//                                     borderColor: getAlpha(theme.palette.primary.main, 0.2),
//                                     '&:hover': { 
//                                       backgroundColor: getAlpha(theme.palette.primary.main, 0.1),
//                                       borderColor: theme.palette.primary.main,
//                                       transform: 'scale(1.1)',
//                                     }
//                                   }}
//                                 >
//                                   <ViewIcon />
//                                 </IconButton>
//                               </Tooltip>
                              
//                               <Tooltip title="Edit Post" placement="top">
//                                 <IconButton
//                                   color="success"
//                                   onClick={() => handleEditPost(post.slug)}
//                                   sx={{
//                                     border: 1,
//                                     borderColor: getAlpha(theme.palette.success.main, 0.2),
//                                     '&:hover': { 
//                                       backgroundColor: getAlpha(theme.palette.success.main, 0.1),
//                                       borderColor: theme.palette.success.main,
//                                       transform: 'scale(1.1)',
//                                     }
//                                   }}
//                                 >
//                                   <EditIcon />
//                                 </IconButton>
//                               </Tooltip>
                              
//                               <Tooltip title="Delete Post" placement="top">
//                                 <IconButton
//                                   color="error"
//                                   onClick={() => handleDeleteClick(post)}
//                                   sx={{
//                                     border: 1,
//                                     borderColor: getAlpha(theme.palette.error.main, 0.2),
//                                     '&:hover': { 
//                                       backgroundColor: getAlpha(theme.palette.error.main, 0.1),
//                                       borderColor: theme.palette.error.main,
//                                       transform: 'scale(1.1)',
//                                     }
//                                   }}
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </Stack>
//                           </Box>
//                         </Box>
//                       </CardContent>
//                     </Box>
//                   </Card>
//                 </Fade>
//               </Grid>
//             ))}
//           </Grid>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
//               <Card sx={{ borderRadius: 3, p: 2 }}>
//                 <Pagination
//                   count={totalPages}
//                   page={page}
//                   onChange={handlePageChange}
//                   color="primary"
//                   size={isMobile ? "medium" : "large"}
//                   showFirstButton
//                   showLastButton
//                   sx={{
//                     '& .MuiPaginationItem-root': {
//                       borderRadius: 2,
//                       fontWeight: 600,
//                     }
//                   }}
//                 />
//               </Card>
//             </Box>
//           )}
//         </>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         open={deleteDialog.open}
//         onClose={handleDeleteCancel}
//         onConfirm={handleDeleteConfirm}
//         title="Delete Blog Post"
//         message={`Are you sure you want to delete "${deleteDialog.post?.title}"? This action cannot be undone.`}
//         confirmText="Delete Post"
//         cancelText="Keep Post"
//         variant="error"
//         severity="high"
//         loading={deleteDialog.loading}
//         details={[
//           'The post will be permanently removed from your blog',
//           'All associated comments and interactions will be lost',
//           'The post URL will become inactive',
//           'This action cannot be reversed'
//         ]}
//       />
//     </Box>
//   )
// }