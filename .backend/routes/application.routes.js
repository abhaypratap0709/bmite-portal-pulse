const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getApplication,
  updateApplication,
  submitApplication,
  checkEligibility,
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, applicationSchema } = require('../middleware/validator');

// All routes require authentication
router.use(protect);

router.post('/', authorize('student'), validate(applicationSchema), createApplication);
router.get('/my', getMyApplications);
router.post('/check-eligibility', checkEligibility);
router.get('/:id', getApplication);
router.put('/:id', authorize('student'), updateApplication);
router.put('/:id/submit', authorize('student'), submitApplication);

module.exports = router;

