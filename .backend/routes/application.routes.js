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
const { 
  validateBody, 
  validateParams, 
  validateQuery, 
  applicationSchema, 
  mongoIdSchema, 
  applicationQuerySchema 
} = require('../middleware/validator');

// All routes require authentication
router.use(protect);

router.post('/', authorize('student'), validateBody(applicationSchema), createApplication);
router.get('/my', validateQuery(applicationQuerySchema), getMyApplications);
router.post('/check-eligibility', checkEligibility);
router.get('/:id', validateParams(mongoIdSchema), getApplication);
router.put('/:id', authorize('student'), validateParams(mongoIdSchema), validateBody(applicationSchema), updateApplication);
router.put('/:id/submit', authorize('student'), validateParams(mongoIdSchema), submitApplication);

module.exports = router;

