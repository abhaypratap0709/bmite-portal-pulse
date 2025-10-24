const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Announcement description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['General', 'Academic', 'Examination', 'Placement', 'Event', 'Emergency', 'Maintenance'],
        message: 'Category must be one of: General, Academic, Examination, Placement, Event, Emergency, Maintenance'
      },
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    targetAudience: {
      type: [String],
      enum: ['students', 'faculty', 'all'],
      default: ['all'],
      validate: {
        validator: function(audience) {
          return audience.length > 0;
        },
        message: 'At least one target audience must be specified'
      }
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function(date) {
          return !date || date > this.publishDate;
        },
        message: 'Expiry date must be after publish date'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      fileName: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
      fileSize: {
        type: Number,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    views: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ category: 1, publishDate: -1 });
announcementSchema.index({ targetAudience: 1, isActive: 1 });
announcementSchema.index({ isPinned: -1, publishDate: -1 });
announcementSchema.index({ priority: 1, publishDate: -1 });
announcementSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for formatted publish date
announcementSchema.virtual('formattedDate').get(function () {
  return this.publishDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Virtual for time ago
announcementSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - this.publishDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return this.publishDate.toLocaleDateString();
});

// Method to check if announcement is expired
announcementSchema.methods.isExpired = function() {
  return this.expiryDate && new Date() > this.expiryDate;
};

// Method to increment views
announcementSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Ensure virtuals are included in JSON
announcementSchema.set('toJSON', { virtuals: true });
announcementSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Announcement', announcementSchema);
