const Course = require('../models/Course.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const {
      department,
      admissionStatus,
      q, // search query
      minFees,
      maxFees,
      duration,
      sort = '-popularityScore',
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Department filter
    if (department) {
      query.department = department;
    }

    // Admission status filter
    if (admissionStatus) {
      query.admissionStatus = admissionStatus;
    }

    // Duration filter
    if (duration) {
      query['duration.years'] = parseInt(duration);
    }

    // Fees range filter
    if (minFees || maxFees) {
      query['fees.total'] = {};
      if (minFees) query['fees.total'].$gte = parseInt(minFees);
      if (maxFees) query['fees.total'].$lte = parseInt(maxFees);
    }

    // Search functionality - case-insensitive regex search
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      query.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { description: searchRegex },
        { 'highlights': searchRegex },
        { 'prerequisites': searchRegex }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const courses = await Course.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('faculty', 'profile.firstName profile.lastName profile.avatar');

    // Get total count
    const total = await Course.countDocuments(query);

    // Get filter options for frontend
    const departments = await Course.distinct('department', { isActive: true });
    const admissionStatuses = await Course.distinct('admissionStatus', { isActive: true });
    const durations = await Course.distinct('duration.years', { isActive: true });

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: courses,
      filters: {
        departments,
        admissionStatuses,
        durations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'faculty',
      'profile.firstName profile.lastName profile.avatar email'
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments
// @route   GET /api/courses/departments
// @access  Public
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Course.distinct('department', { isActive: true });

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search courses
// @route   GET /api/courses/search
// @access  Public
exports.searchCourses = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const courses = await Course.find(
      {
        $text: { $search: q },
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate course fees
// @route   POST /api/courses/calculate-fees
// @access  Public
exports.calculateFees = async (req, res, next) => {
  try {
    const { courseId, hostelRequired, transportRequired } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    let totalFees = course.fees.tuition;

    if (hostelRequired) {
      totalFees += course.fees.hostel;
    }

    if (transportRequired) {
      totalFees += course.fees.transport;
    }

    totalFees += course.fees.other;

    res.status(200).json({
      success: true,
      data: {
        courseName: course.name,
        breakdown: {
          tuition: course.fees.tuition,
          hostel: hostelRequired ? course.fees.hostel : 0,
          transport: transportRequired ? course.fees.transport : 0,
          other: course.fees.other,
        },
        total: totalFees,
      },
    });
  } catch (error) {
    next(error);
  }
};

