'use client'

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Chip,
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material'
import { useState, useRef } from 'react'
import api from '../../lib/adminApi'

const ImageUpload = ({ open, onClose, onImageSelect, multiple = false }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    uploadImages(files)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragOver(false)
    const files = Array.from(event.dataTransfer.files)
    uploadImages(files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragOver(false)
  }

  const uploadImages = async (files) => {
    if (files.length === 0) return

    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )

    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Only images under 5MB are allowed.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      
      if (multiple) {
        validFiles.forEach(file => formData.append('images', file))
        const response = await api.post('/upload/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (response.data.success) {
          setUploadedImages(prev => [...prev, ...response.data.data])
        }
      } else {
        formData.append('image', validFiles[0])
        const response = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (response.data.success) {
          setUploadedImages(prev => [...prev, response.data.data])
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const copyImageUrl = (url) => {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
  }

  const insertImage = (imageData) => {
    onImageSelect(imageData)
    onClose()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">📸 Upload Images</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Upload Area */}
        <Box
          sx={{
            border: 2,
            borderColor: dragOver ? 'primary.main' : 'grey.300',
            borderStyle: 'dashed',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: dragOver ? 'primary.50' : 'grey.50',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            mb: 3,
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {dragOver ? '📁 Drop images here' : '☁️ Upload Images'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop images here, or click to select files
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Supported formats: JPG, PNG, GIF, WebP (Max 5MB each)
          </Typography>
          
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={uploading}
            startIcon={<UploadIcon />}
          >
            Choose Files
          </Button>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              ⏳ Uploading images...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🖼️ Uploaded Images ({uploadedImages.length})
            </Typography>
            <Grid container spacing={2}>
              {uploadedImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${image.url}`}
                      alt={image.originalName}
                      sx={{ 
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => insertImage(image)}
                    />
                    <CardActions sx={{ p: 1, flexDirection: 'column', alignItems: 'stretch' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                          {image.originalName}
                        </Typography>
                        <Chip 
                          label={formatFileSize(image.size)} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CopyIcon fontSize="small" />}
                          onClick={() => copyImageUrl(image.url)}
                          sx={{ flex: 1 }}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => insertImage(image)}
                          sx={{ flex: 1 }}
                        >
                          Insert
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Empty State */}
        {uploadedImages.length === 0 && !uploading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No images uploaded yet. Upload some images to get started! 🚀
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          💡 Tip: Click on an image preview to insert it directly
        </Typography>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageUpload