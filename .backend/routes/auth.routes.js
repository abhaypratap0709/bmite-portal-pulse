const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, logout, changePassword, refreshToken } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { 
  validateBody, 
  validateParams, 
  registerSchema, 
  loginSchema, 
  changePasswordSchema, 
  updateProfileSchema,
  mongoIdSchema 
} = require('../middleware/validator');
const { authLimiter, registrationLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/register', registrationLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateBody(updateProfileSchema), updateProfile);
router.post('/logout', protect, logout);
router.put('/password', protect, passwordResetLimiter, validateBody(changePasswordSchema), changePassword);

module.exports = router;

