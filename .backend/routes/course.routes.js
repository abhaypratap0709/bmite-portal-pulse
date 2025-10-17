const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  getDepartments,
  searchCourses,
  calculateFees,
} = require('../controllers/course.controller');
const { validateQuery, validateParams, validateBody, courseQuerySchema, mongoIdSchema } = require('../middleware/validator');

// Public routes
router.get('/', validateQuery(courseQuerySchema), getCourses);
router.get('/search', searchCourses);
router.get('/departments', getDepartments);
router.post('/calculate-fees', calculateFees);
router.get('/:id', validateParams(mongoIdSchema), getCourse);

module.exports = router;

