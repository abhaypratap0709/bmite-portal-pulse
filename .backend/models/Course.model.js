const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: [
        'Computer Science',
        'Mechanical',
        'Electronics & Communication',
        'Civil',
        'Electrical',
        'Information Technology',
        'Management',
        'Applied Sciences',
      ],
    },
    duration: {
      years: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      semesters: {
        type: Number,
        required: true,
      },
    },
    fees: {
      tuition: {
        type: Number,
        required: [true, 'Tuition fee is required'],
        min: 0,
      },
      hostel: {
        type: Number,
        default: 0,
        min: 0,
      },
      transport: {
        type: Number,
        default: 0,
        min: 0,
      },
      other: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
      },
    },
    eligibility: [
      {
        criteria: {
          type: String,
          required: true,
        },
        minimumPercentage: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],
    seats: {
      total: {
        type: Number,
        required: true,
        min: 0,
      },
      available: {
        type: Number,
        required: true,
        min: 0,
      },
      reserved: {
        general: Number,
        obc: Number,
        sc: Number,
        st: Number,
      },
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    curriculum: [
      {
        semester: {
          type: Number,
          required: true,
        },
        subjects: [
          {
            name: String,
            code: String,
            credits: Number,
          },
        ],
      },
    ],
    faculty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    prerequisites: [
      {
        type: String,
      },
    ],
    highlights: [
      {
        type: String,
      },
    ],
    admissionStatus: {
      type: String,
      enum: ['open', 'closed', 'coming-soon'],
      default: 'open',
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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

// Calculate total fees before saving
courseSchema.pre('save', function (next) {
  this.fees.total = this.fees.tuition + this.fees.hostel + this.fees.transport + this.fees.other;
  next();
});

// Text index for searching
courseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);

