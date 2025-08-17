import { Router } from "express";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.js'; 
const uploadRouter = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { 
        width: 1200, 
        height: 800, 
        crop: 'limit', 
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1E9);
      return `blog-${timestamp}-${random}`;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

uploadRouter.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageData = {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format,
      resourceType: req.file.resource_type,
      createdAt: new Date().toISOString(),
      uploadedBy: req.user?.id || 'anonymous'
    };

    res.json({
      success: true,
      data: imageData
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
});

uploadRouter.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      width: file.width,
      height: file.height,
      format: file.format,
      resourceType: file.resource_type,
      createdAt: new Date().toISOString(),
      uploadedBy: req.user?.id
    }));

    res.json({
      success: true,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Images upload failed',
      error: error.message
    });
  }
});

uploadRouter.delete('/image/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    const result = await cloudinary.uploader.destroy(`blog-images/${publicId}`);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully from Cloudinary'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Get image transformations (optional - for different sizes)
uploadRouter.get('/image/:publicId/transform', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, crop = 'fill', quality = 'auto' } = req.query;
    
    const transformedUrl = cloudinary.url(`blog-images/${publicId}`, {
      width: width || 800,
      height: height || 600,
      crop: crop,
      quality: quality,
      fetch_format: 'auto'
    });

    res.json({
      success: true,
      data: {
        originalUrl: cloudinary.url(`blog-images/${publicId}`),
        transformedUrl: transformedUrl,
        publicId: publicId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate transformed URL',
      error: error.message
    });
  }
});

export default uploadRouter;