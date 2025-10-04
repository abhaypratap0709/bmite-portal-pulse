const express = require('express');
const router = express.Router();
const {
  getPlacementStats,
  getPlacements,
  registerForPlacement,
  getCompanies,
} = require('../controllers/placement.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', getPlacementStats);
router.get('/companies', getCompanies);
router.get('/', getPlacements);
router.post('/register', protect, authorize('student'), registerForPlacement);

module.exports = router;

