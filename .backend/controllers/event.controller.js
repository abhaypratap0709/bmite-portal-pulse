const Event = require('../models/Event.model');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { status = 'upcoming', eventType, page = 1, limit = 10 } = req.query;

    const query = { isPublic: true };
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;

    const skip = (page - 1) * limit;
    const events = await Event.find(query)
      .populate('organizer', 'profile.firstName profile.lastName')
      .sort('startDate')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'profile.firstName profile.lastName email'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already registered
    if (event.registeredParticipants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Check capacity
    if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    event.registeredParticipants.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for the event',
    });
  } catch (error) {
    next(error);
  }
};

