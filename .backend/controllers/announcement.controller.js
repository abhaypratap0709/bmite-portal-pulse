const Announcement = require('../models/Announcement.model');
const User = require('../models/User.model');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const { 
      category, 
      priority, 
      targetAudience, 
      isPinned,
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    // Build query
    const query = { 
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter by target audience
    if (targetAudience) {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    }

    // Filter by pinned status
    if (isPinned !== undefined) {
      query.isPinned = isPinned === 'true';
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Get announcements with sorting (pinned first, then by date)
    const announcements = await Announcement.find(query)
      .populate('author', 'profile.firstName profile.lastName')
      .sort({ isPinned: -1, publishDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    // Get total count for pagination
    const total = await Announcement.countDocuments(query);

    // Get recent announcements count (last 7 days)
    const recentCount = await Announcement.countDocuments({
      ...query,
      publishDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      recentCount,
      data: announcements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        hasNext: skip + limitNum < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get announcement by ID
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'profile.firstName profile.lastName email')
      .select('-__v');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check if announcement is active and not expired
    if (!announcement.isActive || announcement.isExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found or expired',
      });
    }

    // Increment view count
    await announcement.incrementViews();

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Admin/Faculty)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      targetAudience,
      expiryDate,
      isPinned,
      tags,
    } = req.body;

    // Get author information
    const author = await User.findById(req.user.id).select('profile.firstName profile.lastName');
    
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Create announcement data
    const announcementData = {
      title,
      description,
      category: category || 'General',
      priority: priority || 'medium',
      targetAudience: targetAudience || ['all'],
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isPinned: isPinned || false,
      tags: tags || [],
      author: req.user.id,
      authorName: `${author.profile.firstName} ${author.profile.lastName}`,
    };

    const announcement = await Announcement.create(announcementData);

    // Populate author information
    await announcement.populate('author', 'profile.firstName profile.lastName');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin/Faculty)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      targetAudience,
      expiryDate,
      isPinned,
      tags,
      isActive,
    } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement',
      });
    }

    // Update fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (tags !== undefined) updateData.tags = tags;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'profile.firstName profile.lastName');

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Check if user is admin or the author
    if (req.user.role !== 'admin' && announcement.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement',
      });
    }

    // Soft delete by setting isActive to false
    announcement.isActive = false;
    await announcement.save();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get announcement statistics
// @route   GET /api/announcements/stats
// @access  Private (Admin)
exports.getAnnouncementStats = async (req, res, next) => {
  try {
    const [
      totalAnnouncements,
      activeAnnouncements,
      expiredAnnouncements,
      categoryStats,
      priorityStats,
      recentAnnouncements
    ] = await Promise.all([
      Announcement.countDocuments(),
      Announcement.countDocuments({ isActive: true }),
      Announcement.countDocuments({ 
        isActive: true,
        expiryDate: { $lt: new Date() }
      }),
      Announcement.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Announcement.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Announcement.countDocuments({
        isActive: true,
        publishDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalAnnouncements,
        active: activeAnnouncements,
        expired: expiredAnnouncements,
        recent: recentAnnouncements,
        categoryDistribution: categoryStats,
        priorityDistribution: priorityStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent announcements (for dashboard)
// @route   GET /api/announcements/recent
// @access  Public
exports.getRecentAnnouncements = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    })
      .populate('author', 'profile.firstName profile.lastName')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit)
      .select('title description category priority publishDate authorName isPinned');

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};
