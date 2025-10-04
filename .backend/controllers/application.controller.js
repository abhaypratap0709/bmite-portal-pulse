const Application = require('../models/Application.model');
const Course = require('../models/Course.model');

// @desc    Submit new application
// @route   POST /api/applications
// @access  Private (Student)
exports.createApplication = async (req, res, next) => {
  try {
    const { courseId, personalInfo, academicRecords, personalStatement, preferences } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user already applied for this course
    const existingApplication = await Application.findOne({
      userId: req.user.id,
      courseId,
      status: { $nin: ['withdrawn', 'rejected'] },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this course',
      });
    }

    // Create application
    const application = await Application.create({
      userId: req.user.id,
      courseId,
      personalInfo,
      academicRecords,
      personalStatement,
      preferences,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('courseId', 'name code department fees')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('courseId')
      .populate('userId', 'email profile');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership or admin
    if (application.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Can't update if already submitted
    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application after submission',
      });
    }

    application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit application (change status from draft)
// @route   PUT /api/applications/:id/submit
// @access  Private
exports.submitApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Application already submitted',
      });
    }

    application.status = 'submitted';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check eligibility for course
// @route   POST /api/applications/check-eligibility
// @access  Private
exports.checkEligibility = async (req, res, next) => {
  try {
    const { courseId, tenthPercentage, twelfthPercentage } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    let eligible = true;
    const failedCriteria = [];

    // Check eligibility criteria
    course.eligibility.forEach((criterion) => {
      if (criterion.criteria.includes('10th') && tenthPercentage < criterion.minimumPercentage) {
        eligible = false;
        failedCriteria.push(`10th grade minimum: ${criterion.minimumPercentage}%`);
      }
      if (criterion.criteria.includes('12th') && twelfthPercentage < criterion.minimumPercentage) {
        eligible = false;
        failedCriteria.push(`12th grade minimum: ${criterion.minimumPercentage}%`);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        eligible,
        courseName: course.name,
        failedCriteria: failedCriteria.length > 0 ? failedCriteria : null,
        message: eligible
          ? 'You are eligible to apply for this course'
          : 'You do not meet the eligibility criteria',
      },
    });
  } catch (error) {
    next(error);
  }
};

