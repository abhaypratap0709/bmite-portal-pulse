const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    eventType: {
      type: String,
      enum: {
        values: ['workshop', 'seminar', 'conference', 'competition', 'fest', 'other'],
        message: 'Event type must be one of: workshop, seminar, conference, competition, fest, other'
      },
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    venue: {
      location: {
        type: String,
        required: [true, 'Venue location is required'],
        maxlength: [100, 'Location cannot exceed 100 characters'],
      },
      room: {
        type: String,
        maxlength: [50, 'Room name cannot exceed 50 characters'],
      },
      capacity: {
        type: Number,
        min: [1, 'Capacity must be at least 1'],
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizerName: {
      type: String,
      required: [true, 'Organizer name is required'],
      maxlength: [100, 'Organizer name cannot exceed 100 characters'],
    },
    department: {
      type: String,
      maxlength: [50, 'Department name cannot exceed 50 characters'],
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: Date,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    maxParticipants: {
      type: Number,
      min: [1, 'Maximum participants must be at least 1'],
    },
    registeredParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    banner: {
      type: String,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update status based on dates
eventSchema.pre('save', function (next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'completed';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'ongoing';
  }
  next();
});

// Index for efficient querying
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ isPublic: 1, status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ department: 1 });
eventSchema.index({ title: 'text', description: 'text' }); // Text search

module.exports = mongoose.model('Event', eventSchema);

