import mongoose from "mongoose"
import slugify from "slugify"

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  featuredImage: {
    type: String,
    default: null
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  next();
});

// Set publishedAt when published
postSchema.pre('save', function(next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Ensure unique slug
postSchema.pre('save', async function(next) {
  if (!this.isModified('title')) return next();
  
  let slug = this.slug;
  let counter = 1;
  
  while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${this.slug}-${counter}`;
    counter++;
  }
  
  this.slug = slug;
  next();
});
const PostModel = mongoose.model("Post", postSchema);

export default PostModel;