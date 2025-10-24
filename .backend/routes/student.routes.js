const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadPhoto,
} = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Student profile routes
router.get('/profile', authorize('student'), getProfile);
router.put('/profile', authorize('student'), updateProfile);
router.post('/profile/photo', authorize('student'), uploadPhoto);

module.exports = router;
