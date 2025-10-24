const express = require('express');
const router = express.Router();
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  getRecentAnnouncements,
} = require('../controllers/announcement.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getAllAnnouncements);
router.get('/recent', getRecentAnnouncements);
router.get('/:id', getAnnouncementById);

// Protected routes
router.use(protect);

// Admin and faculty routes
router.post('/', authorize('admin', 'faculty'), createAnnouncement);
router.put('/:id', authorize('admin', 'faculty'), updateAnnouncement);
router.delete('/:id', authorize('admin', 'faculty'), deleteAnnouncement);

// Admin only routes
router.get('/stats/overview', authorize('admin'), getAnnouncementStats);

module.exports = router;
