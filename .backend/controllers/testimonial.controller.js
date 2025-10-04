const Testimonial = require('../models/Testimonial.model');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
  try {
    const { featured, limit = 10 } = req.query;

    const query = { isApproved: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort('-isFeatured order -createdAt')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonialData = {
      ...req.body,
      userId: req.user.id,
    };

    const testimonial = await Testimonial.create(testimonialData);

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed by admin.',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

