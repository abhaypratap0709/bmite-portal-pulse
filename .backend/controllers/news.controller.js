const News = require('../models/News.model');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res, next) => {
  try {
    const { category, featured, status = 'published', page = 1, limit = 10 } = req.query;

    // Build query
    const query = { status, isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const news = await News.find(query)
      .populate('author', 'profile.firstName profile.lastName')
      .sort('-publishDate')
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
exports.getSingleNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id).populate(
      'author',
      'profile.firstName profile.lastName profile.avatar'
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    // Increment views
    news.views += 1;
    await news.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news categories
// @route   GET /api/news/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await News.distinct('category', { status: 'published', isActive: true });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a news article
// @route   PUT /api/news/:id/like
// @access  Public
exports.likeNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    news.likes += 1;
    await news.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: { likes: news.likes },
    });
  } catch (error) {
    next(error);
  }
};

