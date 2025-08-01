'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  Chip,
} from '@mui/material'
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material'

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  severity = 'medium',
  loading = false,
  details = [],
  showIcon = true,
}) => {
  const getVariantConfig = () => {
    const configs = {
      warning: {
        icon: WarningIcon,
        color: 'warning',
        bgColor: '#fff3e0', 
        borderColor: '#ed6c02',
      },
      error: {
        icon: ErrorIcon,
        color: 'error',
        bgColor: '#ffebee',
        borderColor: '#d32f2f',
      },
      info: {
        icon: InfoIcon,
        color: 'info',
        bgColor: '#e3f2fd', 
        borderColor: '#0288d1',
      },
      success: {
        icon: SuccessIcon,
        color: 'success',
        bgColor: '#e8f5e8', 
        borderColor: '#2e7d32', 
      },
    }
    return configs[variant] || configs.warning
  }

  const getSeverityProps = () => {
    const severityProps = {
      low: {
        confirmVariant: 'outlined',
        confirmColor: 'primary',
      },
      medium: {
        confirmVariant: 'contained',
        confirmColor: 'warning',
      },
      high: {
        confirmVariant: 'contained',
        confirmColor: 'error',
      },
    }
    return severityProps[severity] || severityProps.medium
  }

  const config = getVariantConfig()
  const severityProps = getSeverityProps()
  const IconComponent = config.icon

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `2px solid`,
          borderColor: config.borderColor,
          borderOpacity: 0.2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showIcon && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: config.bgColor,
                  color: config.borderColor,
                }}
              >
                <IconComponent />
              </Box>
            )}
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Chip
              label={severity.toUpperCase()}
              size="small"
              color={config.color}
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {details.length > 0 && (
          <Alert severity={variant} sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Details:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {details.map((detail, index) => (
                <li key={index}>
                  <Typography variant="body2">{detail}</Typography>
                </li>
              ))}
            </Box>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant={severityProps.confirmVariant}
          color={severityProps.confirmColor}
          disabled={loading}
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog