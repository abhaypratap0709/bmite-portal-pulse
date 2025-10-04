const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

// User registration validation schema
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  profile: Joi.object({
    firstName: Joi.string().required().messages({
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().required().messages({
      'any.required': 'Last name is required',
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .messages({
        'string.pattern.base': 'Phone number must be 10 digits',
      }),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid('male', 'female', 'other'),
  }).required(),
  role: Joi.string().valid('student', 'faculty').default('student'),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Application submission validation schema
const applicationSchema = Joi.object({
  courseId: Joi.string().required(),
  personalInfo: Joi.object({
    fatherName: Joi.string().required(),
    motherName: Joi.string().required(),
    category: Joi.string().valid('general', 'obc', 'sc', 'st', 'other').required(),
    nationality: Joi.string().default('Indian'),
  }).required(),
  academicRecords: Joi.object({
    tenth: Joi.object({
      board: Joi.string().required(),
      school: Joi.string().required(),
      percentage: Joi.number().min(0).max(100).required(),
      yearOfPassing: Joi.number().required(),
    }).required(),
    twelfth: Joi.object({
      board: Joi.string().required(),
      school: Joi.string().required(),
      stream: Joi.string().valid('science', 'commerce', 'arts').required(),
      percentage: Joi.number().min(0).max(100).required(),
      yearOfPassing: Joi.number().required(),
    }).required(),
  }).required(),
  personalStatement: Joi.string().max(1000),
  preferences: Joi.object({
    hostelRequired: Joi.boolean(),
    transportRequired: Joi.boolean(),
    scholarshipInterest: Joi.boolean(),
  }),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  applicationSchema,
};

