import { Router } from "express";
import { checkToken } from "../../middlewares/checkToken.js";
import PostModel from "./model.js";
const postRouter = Router();

 

// Simple validation
const validatePost = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
  }
  
  if (!isUpdate || data.content !== undefined) {
    if (!data.content || data.content.trim().length === 0) {
      errors.push('Content is required');
    }
  }
  
  return errors;
};

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
postRouter.get('/', async (req, res) => {
  try {
    const { published, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (published === 'true') {
      query.published = true;
    }
    
    const posts = await PostModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await PostModel.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        posts,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
});

// @route   GET /api/posts/:slug
// @desc    Get single post by slug
// @access  Public
postRouter.get('/:slug', async (req, res) => {
  try {
    const post = await PostModel.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    if (post.published) {
      post.views += 1;
      await post.save();
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
postRouter.post('/', checkToken, async (req, res) => {
  try {
    const errors = validatePost(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    const {
      title,
      content,
      excerpt,
      featuredImage,
      published = false,
      tags = []
    } = req.body;
    
    const post = new PostModel({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt ? excerpt.trim() : '',
      featuredImage,
      published,
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()) : []
    });
    
    await post.save();
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
postRouter.put('/:id', checkToken, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const errors = validatePost(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    const updateFields = {};
    
    if (req.body.title !== undefined) updateFields.title = req.body.title.trim();
    if (req.body.content !== undefined) updateFields.content = req.body.content.trim();
    if (req.body.excerpt !== undefined) updateFields.excerpt = req.body.excerpt.trim();
    if (req.body.featuredImage !== undefined) updateFields.featuredImage = req.body.featuredImage;
    if (req.body.published !== undefined) updateFields.published = req.body.published;
    if (req.body.tags !== undefined) {
      updateFields.tags = Array.isArray(req.body.tags) 
        ? req.body.tags.map(tag => tag.trim()) 
        : [];
    }
    
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating post'
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
postRouter.delete('/:id',  async (req, res) => {

  try {
    console.log(req.body)
    const post = await PostModel.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    await PostModel.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post'
    });
  }
});

// @route   PUT /api/posts/:id/toggle-publish
// @desc    Toggle post published status
// @access  Private
postRouter.put('/:id/toggle-publish', checkToken, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    post.published = !post.published;
    if (post.published && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    
    await post.save();
    
    res.json({
      success: true,
      data: post,
      message: `Post ${post.published ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post status'
    });
  }
});

// @route   GET /api/posts/stats/dashboard
// @desc    Get simple dashboard stats
// @access  Private
postRouter.get('/stats/dashboard', checkToken, async (req, res) => {
  try {
    const [total, published, drafts, totalViews] = await Promise.all([
      PostModel.countDocuments(),
      PostModel.countDocuments({ published: true }),
      PostModel.countDocuments({ published: false }),
      PostModel.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        published,
        drafts,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});



export default postRouter;