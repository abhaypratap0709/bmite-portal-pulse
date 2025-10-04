const Placement = require('../models/Placement.model');

// @desc    Get placement statistics
// @route   GET /api/placements/stats
// @access  Public
exports.getPlacementStats = async (req, res, next) => {
  try {
    const { batch } = req.query;

    // Year-wise placement data
    const yearlyStats = await Placement.aggregate([
      { $match: { status: { $in: ['accepted', 'joined'] } } },
      {
        $group: {
          _id: '$batch',
          placed: { $sum: 1 },
          avgPackage: { $avg: '$packageOffered' },
          maxPackage: { $max: '$packageOffered' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Sector-wise distribution
    const sectorStats = await Placement.aggregate([
      { $match: { status: { $in: ['accepted', 'joined'] } } },
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top companies
    const topCompanies = await Placement.aggregate([
      { $match: { status: { $in: ['accepted', 'joined'] } } },
      {
        $group: {
          _id: '$companyName',
          hires: { $sum: 1 },
          avgPackage: { $avg: '$packageOffered' },
        },
      },
      { $sort: { hires: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        yearlyStats,
        sectorStats,
        topCompanies,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all placements
// @route   GET /api/placements
// @access  Public
exports.getPlacements = async (req, res, next) => {
  try {
    const { batch, sector, page = 1, limit = 10 } = req.query;

    const query = { isVisible: true };
    if (batch) query.batch = batch;
    if (sector) query.sector = sector;

    const skip = (page - 1) * limit;
    const placements = await Placement.find(query)
      .populate('studentId', 'profile.firstName profile.lastName profile.avatar')
      .populate('courseId', 'name')
      .sort('-placementDate')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Placement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: placements.length,
      total,
      data: placements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for placement
// @route   POST /api/placements/register
// @access  Private (Student)
exports.registerForPlacement = async (req, res, next) => {
  try {
    // Simple registration logic - in real app would be more complex
    res.status(200).json({
      success: true,
      message: 'Registered for placement successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiting companies
// @route   GET /api/placements/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Placement.aggregate([
      { $match: { isVisible: true } },
      {
        $group: {
          _id: '$companyName',
          logo: { $first: '$companyLogo' },
          totalHires: { $sum: 1 },
        },
      },
      { $sort: { totalHires: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

