'use client'

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  useTheme,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '../../../../../../lib/adminApi'

export default function EditGuideTablePage() {
  const theme = useTheme()
  const router = useRouter()
  const { id } = useParams()

  // Optional: overall title/desc for the "guide table" (not required)
  const [guideTitle, setGuideTitle] = useState('')
  const [guideDesc, setGuideDesc] = useState('')

  // Table rows: array of { purpose, guide, link }
  const [rows, setRows] = useState([
    { purpose: '', guide: '', link: '' },
    { purpose: '', guide: '', link: '' },
    { purpose: '', guide: '', link: '' }
  ])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })

  // Load guide
  useEffect(() => {
    if (id) {
      setLoading(true)
      api.get(`/guides/${id}`).then(res => {
        if (res.data && res.data.data) {
          setGuideTitle(res.data.data.title || '')
          setGuideDesc(res.data.data.description || '')
          setRows(res.data.data.rows && res.data.data.rows.length > 0 ? res.data.data.rows : [{ purpose: '', guide: '', link: '' }])
        }
      }).catch(() => {
        setNotification({ open: true, message: 'Failed to load guide', severity: 'error' })
      }).finally(() => setLoading(false))
    }
    // eslint-disable-next-line
  }, [id])

  const handleRowChange = (idx, field, value) => {
    setRows(r => r.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    ))
  }

  const handleAddRow = () => {
    setRows(r => [...r, { purpose: '', guide: '', link: '' }])
  }

  const handleRemoveRow = (idx) => {
    setRows(r => r.length > 1 ? r.filter((_, i) => i !== idx) : r)
  }

  const handleSave = async () => {
    const validRows = rows.filter(r => r.purpose || r.guide || r.link)
    if (validRows.length === 0) {
      setNotification({ open: true, message: 'Please add at least one guide row.', severity: 'warning' })
      return
    }
    setSaving(true)
    try {
      const guideData = {
        title: guideTitle.trim(),
        description: guideDesc.trim(),
        rows: validRows,
      }
      const res = await api.put(`/guides/${id}`, guideData)
      if (res.data?.success) {
        setNotification({ open: true, message: 'Guide updated!', severity: 'success' })
        setTimeout(() => router.push('/dashboard'), 1200)
      } else {
        setNotification({ open: true, message: 'Failed to update guide', severity: 'error' })
      }
    } catch (e) {
      setNotification({ open: true, message: 'Failed to update guide', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => router.push('/dashboard')

  if (loading) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography color="text.secondary">Loading...</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 'none' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <IconButton onClick={handleBack} size="small" sx={{ color: theme.palette.text.secondary }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>
              Edit Guide Table
            </Typography>
          </Stack>
          <Stack spacing={2} mb={3}>
            <TextField
              label="Title (optional)"
              value={guideTitle}
              onChange={e => setGuideTitle(e.target.value)}
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              label="Description (optional)"
              value={guideDesc}
              onChange={e => setGuideDesc(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={2}
              maxRows={4}
              inputProps={{ maxLength: 500 }}
            />
          </Stack>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: "30%" }}>Purpose</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "40%" }}>Guide</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "25%" }}>Link</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <TextField
                        value={row.purpose}
                        onChange={e => handleRowChange(idx, 'purpose', e.target.value)}
                        variant="standard"
                        placeholder="Purpose"
                        fullWidth
                        inputProps={{ maxLength: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.guide}
                        onChange={e => handleRowChange(idx, 'guide', e.target.value)}
                        variant="standard"
                        placeholder="Guide"
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.link}
                        onChange={e => handleRowChange(idx, 'link', e.target.value)}
                        variant="standard"
                        placeholder="https://link.com"
                        fullWidth
                        inputProps={{ maxLength: 300 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveRow(idx)}
                        disabled={rows.length === 1}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddRow}
                      sx={{ mt: 1, fontWeight: 500 }}
                      size="small"
                    >
                      Add Row
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{ fontWeight: 600, borderRadius: 2, px: 3, textTransform: 'none' }}
              size="large"
            >
              {saving ? 'Saving...' : 'Update Guide Table'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}