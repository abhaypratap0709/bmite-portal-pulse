const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role/Position is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      maxlength: [500, 'Testimonial cannot exceed 500 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    avatar: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
testimonialSchema.index({ isApproved: 1, isFeatured: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);

