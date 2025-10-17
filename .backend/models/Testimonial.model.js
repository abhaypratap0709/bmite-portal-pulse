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
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role/Position is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    batch: {
      type: String,
      required: [true, 'Batch is required'],
      maxlength: [20, 'Batch cannot exceed 20 characters'],
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      minlength: [50, 'Content must be at least 50 characters'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
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
testimonialSchema.index({ batch: 1 });
testimonialSchema.index({ company: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ order: 1, isFeatured: -1 }); // For ordering testimonials

module.exports = mongoose.model('Testimonial', testimonialSchema);

