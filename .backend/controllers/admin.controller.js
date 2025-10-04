const Course = require('../models/Course.model');
const Application = require('../models/Application.model');
const News = require('../models/News.model');
const User = require('../models/User.model');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({ isActive: true });
    const pendingApplications = await Application.countDocuments({ status: 'submitted' });
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        pendingApplications,
        totalApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/admin/courses
// @access  Private (Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const applications = await Application.find(query)
      .populate('userId', 'email profile')
      .populate('courseId', 'name code')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/admin/applications/:id/status
// @access  Private (Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewComments } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    application.reviewComments = reviewComments;
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create news article
// @route   POST /api/admin/news
// @access  Private (Admin/Faculty)
exports.createNews = async (req, res, next) => {
  try {
    const newsData = {
      ...req.body,
      author: req.user.id,
      authorName: req.user.profile.fullName,
    };

    const news = await News.create(newsData);

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news article
// @route   PUT /api/admin/news/:id
// @access  Private (Admin/Faculty)
exports.updateNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news article
// @route   DELETE /api/admin/news/:id
// @access  Private (Admin)
exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'News article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

