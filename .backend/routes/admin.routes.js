const express = require('express');
const router = express.Router();
const {
  getDashboard,
  createCourse,
  updateCourse,
  getAllApplications,
  updateApplicationStatus,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin', 'faculty'));

router.get('/dashboard', getDashboard);

// Course management
router.post('/courses', authorize('admin'), createCourse);
router.put('/courses/:id', authorize('admin'), updateCourse);

// Application management
router.get('/applications', getAllApplications);
router.put('/applications/:id/status', updateApplicationStatus);

// News management
router.post('/news', createNews);
router.put('/news/:id', updateNews);
router.delete('/news/:id', authorize('admin'), deleteNews);

module.exports = router;

