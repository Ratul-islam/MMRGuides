import mongoose from "mongoose";

const guideTableRowSchema = new mongoose.Schema({
  purpose: {
    type: String,
    trim: true,
    maxlength: [100, 'Purpose cannot be more than 100 characters']
  },
  guide: {
    type: String,
    trim: true,
    maxlength: [200, 'Guide cannot be more than 200 characters']
  },
  link: {
    type: String,
    trim: true,
    maxlength: [300, 'Link cannot be more than 300 characters']
  }
}, { _id: false });

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
    default: ''
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  rows: {
    type: [guideTableRowSchema],
    required: true,
    validate: [arr => Array.isArray(arr) && arr.length > 0, 'At least one row is required']
  }
}, {
  timestamps: true
});

const GuideModel = mongoose.models.Guide || mongoose.model("Guide", guideSchema);

export default GuideModel;