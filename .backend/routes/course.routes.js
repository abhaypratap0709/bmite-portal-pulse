const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  getDepartments,
  searchCourses,
  calculateFees,
} = require('../controllers/course.controller');

router.get('/', getCourses);
router.get('/search', searchCourses);
router.get('/departments', getDepartments);
router.post('/calculate-fees', calculateFees);
router.get('/:id', getCourse);

module.exports = router;

