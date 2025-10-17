const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'News content is required'],
      minlength: [50, 'Content must be at least 50 characters'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['General', 'Achievements', 'Events', 'Admissions', 'Research', 'Announcements'],
        message: 'Category must be one of: General, Achievements, Events, Admissions, Research, Announcements'
      },
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
    tags: {
      type: [String],
      validate: {
        validator: function(tags) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags'
      }
    },
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
newsSchema.index({ isActive: 1 });
newsSchema.index({ title: 'text', content: 'text' }); // Text search
newsSchema.index({ publishDate: -1, featured: -1 }); // Compound index for homepage

module.exports = mongoose.model('News', newsSchema);

