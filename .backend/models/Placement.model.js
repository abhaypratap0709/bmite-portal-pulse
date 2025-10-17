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
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    companyLogo: {
      type: String,
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [100, 'Job role cannot exceed 100 characters'],
    },
    jobType: {
      type: String,
      enum: {
        values: ['full-time', 'internship', 'contract', 'part-time'],
        message: 'Job type must be one of: full-time, internship, contract, part-time'
      },
      default: 'full-time',
    },
    packageOffered: {
      type: Number,
      required: [true, 'Package is required'],
      min: 0,
    },
    packageType: {
      type: String,
      enum: {
        values: ['CTC', 'in-hand', 'stipend'],
        message: 'Package type must be one of: CTC, in-hand, stipend'
      },
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
      enum: {
        values: [
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
        message: 'Invalid sector value'
      },
      default: 'IT & Software',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    batch: {
      type: String,
      required: [true, 'Batch is required'],
      maxlength: [20, 'Batch cannot exceed 20 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['offered', 'accepted', 'joined', 'declined'],
        message: 'Status must be one of: offered, accepted, joined, declined'
      },
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
placementSchema.index({ sector: 1 });
placementSchema.index({ jobType: 1 });
placementSchema.index({ status: 1 });
placementSchema.index({ isVisible: 1, status: 1 });

module.exports = mongoose.model('Placement', placementSchema);

