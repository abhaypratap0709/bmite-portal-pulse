const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'contract', 'part-time'],
      default: 'full-time',
    },
    packageOffered: {
      type: Number,
      required: [true, 'Package is required'],
      min: 0,
    },
    packageType: {
      type: String,
      enum: ['CTC', 'in-hand', 'stipend'],
      default: 'CTC',
    },
    placementDate: {
      type: Date,
      default: Date.now,
    },
    joiningDate: {
      type: Date,
    },
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    sector: {
      type: String,
      enum: [
        'IT & Software',
        'Core Engineering',
        'Consulting',
        'Finance',
        'Manufacturing',
        'Healthcare',
        'Education',
        'Government',
        'Other',
      ],
      default: 'IT & Software',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    batch: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['offered', 'accepted', 'joined', 'declined'],
      default: 'offered',
    },
    interviewProcess: {
      rounds: {
        type: Number,
        min: 1,
      },
      duration: String,
      difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
      },
    },
    testimonial: {
      type: String,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
placementSchema.index({ studentId: 1 });
placementSchema.index({ companyName: 1 });
placementSchema.index({ batch: 1 });
placementSchema.index({ placementDate: -1 });

module.exports = mongoose.model('Placement', placementSchema);

