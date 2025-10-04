const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    eventType: {
      type: String,
      enum: ['workshop', 'seminar', 'conference', 'fest', 'competition', 'webinar', 'cultural', 'sports', 'other'],
      default: 'seminar',
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
      location: String,
      room: String,
      capacity: Number,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    organizerName: {
      type: String,
    },
    department: {
      type: String,
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

module.exports = mongoose.model('Event', eventSchema);

