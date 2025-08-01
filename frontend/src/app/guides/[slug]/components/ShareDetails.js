'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close,
  Twitter,
  Facebook,
  LinkedIn,
  ContentCopy,
  WhatsApp,
  Telegram
} from '@mui/icons-material';

export default function ShareDialog({ open, onClose, post }) {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this article: ${post.title}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: LinkedIn,
      color: 'text-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: WhatsApp,
      color: 'text-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: Telegram,
      color: 'text-blue-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          className: "rounded-2xl"
        }}
      >
        <DialogTitle className="flex items-center justify-between pb-2">
          <Typography variant="h6" className="font-semibold">
            Share this article
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent className="pt-4">
          {/* Social Share Buttons */}
          <Typography variant="subtitle2" className="mb-4 text-gray-600">
            Share on social media
          </Typography>
          
          <div className="grid grid-cols-5 gap-4 mb-6">
            {shareLinks.map((platform) => (
              <button
                key={platform.name}
                onClick={() => window.open(platform.url, '_blank', 'width=600,height=400')}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <platform.icon className={`w-8 h-8 ${platform.color} group-hover:scale-110 transition-transform`} />
                <Typography variant="caption" className="mt-2 text-gray-600">
                  {platform.name}
                </Typography>
              </button>
            ))}
          </div>

          {/* Copy URL */}
          <Typography variant="subtitle2" className="mb-3 text-gray-600">
            Or copy link
          </Typography>
          
          <Box className="flex items-center space-x-2">
            <TextField
              fullWidth
              value={currentUrl}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                className: "bg-gray-50"
              }}
            />
            <Button
              variant="contained"
              onClick={handleCopyUrl}
              startIcon={<ContentCopy />}
              className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
            >
              Copy
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success" variant="filled">
          URL copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}