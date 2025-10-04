const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'News content is required'],
    },
    excerpt: {
      type: String,
      maxlength: 200,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Events', 'Achievements', 'Admissions', 'Research', 'General', 'Placement', 'Academic'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate excerpt from content if not provided
newsSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + (this.content.length > 200 ? '...' : '');
  }
  next();
});

// Index for efficient querying
newsSchema.index({ category: 1, publishDate: -1 });
newsSchema.index({ featured: 1 });
newsSchema.index({ status: 1 });

module.exports = mongoose.model('News', newsSchema);

