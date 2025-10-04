const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under-review', 'accepted', 'rejected', 'withdrawn'],
      default: 'draft',
    },
    personalInfo: {
      fatherName: {
        type: String,
        required: [true, 'Father name is required'],
      },
      motherName: {
        type: String,
        required: [true, 'Mother name is required'],
      },
      category: {
        type: String,
        enum: ['general', 'obc', 'sc', 'st', 'other'],
        required: true,
      },
      nationality: {
        type: String,
        default: 'Indian',
      },
      emergencyContact: {
        name: String,
        relation: String,
        phone: String,
      },
    },
    academicRecords: {
      tenth: {
        board: String,
        school: String,
        percentage: {
          type: Number,
          min: 0,
          max: 100,
        },
        yearOfPassing: Number,
      },
      twelfth: {
        board: String,
        school: String,
        stream: {
          type: String,
          enum: ['science', 'commerce', 'arts'],
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100,
        },
        yearOfPassing: Number,
      },
      entrance: {
        examName: String,
        rollNumber: String,
        score: Number,
        rank: Number,
      },
    },
    documents: [
      {
        documentType: {
          type: String,
          enum: [
            'photo',
            'signature',
            'tenth-marksheet',
            'twelfth-marksheet',
            'entrance-card',
            'transfer-certificate',
            'migration-certificate',
            'aadhar',
            'caste-certificate',
            'income-certificate',
            'other',
          ],
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    personalStatement: {
      type: String,
      maxlength: [1000, 'Personal statement cannot exceed 1000 characters'],
    },
    preferences: {
      hostelRequired: {
        type: Boolean,
        default: false,
      },
      transportRequired: {
        type: Boolean,
        default: false,
      },
      scholarshipInterest: {
        type: Boolean,
        default: false,
      },
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewComments: {
      type: String,
    },
    applicationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate application number on submission
applicationSchema.pre('save', async function (next) {
  if (this.isModified('status') && this.status === 'submitted' && !this.applicationNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.applicationNumber = `BMIET${year}${String(count + 1).padStart(6, '0')}`;
    this.submittedAt = new Date();
  }
  next();
});

// Index for efficient querying
applicationSchema.index({ userId: 1, courseId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicationNumber: 1 });

module.exports = mongoose.model('Application', applicationSchema);

