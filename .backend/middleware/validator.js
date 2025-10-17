const Joi = require('joi');

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[property];
    const { error, value } = schema.validate(dataToValidate, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
        value: detail.context?.value,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errorCode: 'VALIDATION_ERROR',
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Validation for different properties
const validateBody = (schema) => validate(schema, 'body');
const validateQuery = (schema) => validate(schema, 'query');
const validateParams = (schema) => validate(schema, 'params');

// Common validation patterns
const commonPatterns = {
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits'
  }),
  percentage: Joi.number().min(0).max(100),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 10),
};

// User registration validation schema
const registerSchema = Joi.object({
  email: commonPatterns.email.messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: commonPatterns.password.messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required',
  }),
  profile: Joi.object({
    firstName: Joi.string().min(2).max(50).trim().required().messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(2).max(50).trim().required().messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required',
    }),
    phone: commonPatterns.phone,
    dateOfBirth: Joi.date().max('now').messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    gender: Joi.string().valid('male', 'female', 'other'),
    address: Joi.object({
      street: Joi.string().max(100),
      city: Joi.string().max(50),
      state: Joi.string().max(50),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).messages({
        'string.pattern.base': 'Pincode must be 6 digits'
      }),
      country: Joi.string().default('India'),
    }),
  }).required(),
  role: Joi.string().valid('student', 'faculty', 'admin').default('student'),
});

// Login validation schema
const loginSchema = Joi.object({
  email: commonPatterns.email,
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Course validation schemas
const courseCreateSchema = Joi.object({
  name: Joi.string().min(5).max(100).trim().required(),
  code: Joi.string().min(2).max(10).uppercase().trim().required(),
  department: Joi.string().valid(
    'Computer Science', 'Mechanical', 'Electronics & Communication', 
    'Civil', 'Electrical', 'Information Technology', 'Management', 'Applied Sciences'
  ).required(),
  duration: Joi.object({
    years: Joi.number().integer().min(1).max(5).required(),
    semesters: Joi.number().integer().min(1).max(10).required(),
  }).required(),
  fees: Joi.object({
    tuition: Joi.number().min(0).required(),
    hostel: Joi.number().min(0).default(0),
    transport: Joi.number().min(0).default(0),
    other: Joi.number().min(0).default(0),
  }).required(),
  eligibility: Joi.array().items(
    Joi.object({
      criteria: Joi.string().required(),
      minimumPercentage: commonPatterns.percentage,
    })
  ).min(1).required(),
  seats: Joi.object({
    total: Joi.number().integer().min(1).required(),
    available: Joi.number().integer().min(0).required(),
    reserved: Joi.object({
      general: Joi.number().integer().min(0),
      obc: Joi.number().integer().min(0),
      sc: Joi.number().integer().min(0),
      st: Joi.number().integer().min(0),
    }),
  }).required(),
  description: Joi.string().min(50).max(2000).required(),
  highlights: Joi.array().items(Joi.string().max(100)),
  prerequisites: Joi.array().items(Joi.string().max(100)),
  admissionStatus: Joi.string().valid('open', 'closed', 'coming-soon').default('open'),
  popularityScore: Joi.number().min(0).max(100).default(0),
});

// Application submission validation schema
const applicationSchema = Joi.object({
  courseId: commonPatterns.objectId.messages({
    'string.pattern.base': 'Invalid course ID format'
  }),
  personalInfo: Joi.object({
    fatherName: Joi.string().min(2).max(50).trim().required(),
    motherName: Joi.string().min(2).max(50).trim().required(),
    category: Joi.string().valid('general', 'obc', 'sc', 'st', 'other').required(),
    nationality: Joi.string().default('Indian'),
    emergencyContact: Joi.object({
      name: Joi.string().max(50),
      relation: Joi.string().max(20),
      phone: commonPatterns.phone,
    }),
  }).required(),
  academicRecords: Joi.object({
    tenth: Joi.object({
      board: Joi.string().min(2).max(50).required(),
      school: Joi.string().min(2).max(100).required(),
      percentage: commonPatterns.percentage.required(),
      yearOfPassing: commonPatterns.year.required(),
    }).required(),
    twelfth: Joi.object({
      board: Joi.string().min(2).max(50).required(),
      school: Joi.string().min(2).max(100).required(),
      stream: Joi.string().valid('science', 'commerce', 'arts').required(),
      percentage: commonPatterns.percentage.required(),
      yearOfPassing: commonPatterns.year.required(),
    }).required(),
    entrance: Joi.object({
      examName: Joi.string().max(50),
      rollNumber: Joi.string().max(20),
      score: Joi.number().min(0),
      rank: Joi.number().integer().min(1),
    }),
  }).required(),
  personalStatement: Joi.string().max(1000).messages({
    'string.max': 'Personal statement cannot exceed 1000 characters'
  }),
  preferences: Joi.object({
    hostelRequired: Joi.boolean().default(false),
    transportRequired: Joi.boolean().default(false),
    scholarshipInterest: Joi.boolean().default(false),
  }),
});

// News validation schema
const newsCreateSchema = Joi.object({
  title: Joi.string().min(10).max(200).trim().required(),
  content: Joi.string().min(50).max(10000).required(),
  category: Joi.string().valid('General', 'Achievements', 'Events', 'Admissions', 'Research', 'Announcements').required(),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  featured: Joi.boolean().default(false),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
});

// Event validation schema
const eventCreateSchema = Joi.object({
  title: Joi.string().min(5).max(100).trim().required(),
  description: Joi.string().min(20).max(2000).required(),
  eventType: Joi.string().valid('workshop', 'seminar', 'conference', 'competition', 'fest', 'other').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  venue: Joi.object({
    location: Joi.string().max(100).required(),
    room: Joi.string().max(50),
    capacity: Joi.number().integer().min(1),
  }).required(),
  organizerName: Joi.string().max(100).required(),
  department: Joi.string().max(50),
  registrationRequired: Joi.boolean().default(false),
  registrationDeadline: Joi.date().when('registrationRequired', {
    is: true,
    then: Joi.required()
  }),
  registrationFee: Joi.number().min(0).default(0),
  maxParticipants: Joi.number().integer().min(1),
  status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').default('upcoming'),
  isPublic: Joi.boolean().default(true),
});

// Testimonial validation schema
const testimonialCreateSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required(),
  role: Joi.string().max(100).required(),
  company: Joi.string().max(100).required(),
  batch: Joi.string().max(20).required(),
  content: Joi.string().min(50).max(1000).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  isApproved: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false),
  order: Joi.number().integer().min(1),
});

// Query validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().max(50).default('-createdAt'),
});

const courseQuerySchema = paginationSchema.keys({
  department: Joi.string().max(50),
  admissionStatus: Joi.string().valid('open', 'closed', 'coming-soon'),
  search: Joi.string().max(100),
});

const applicationQuerySchema = paginationSchema.keys({
  status: Joi.string().valid('draft', 'submitted', 'under-review', 'accepted', 'rejected', 'withdrawn'),
  courseId: commonPatterns.objectId,
});

// Parameter validation schemas
const mongoIdSchema = Joi.object({
  id: commonPatterns.objectId,
});

// Password change schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: commonPatterns.password,
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Confirm password must match new password'
  }),
});

// Profile update schema
const updateProfileSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().min(2).max(50).trim(),
    lastName: Joi.string().min(2).max(50).trim(),
    phone: commonPatterns.phone,
    dateOfBirth: Joi.date().max('now'),
    gender: Joi.string().valid('male', 'female', 'other'),
    address: Joi.object({
      street: Joi.string().max(100),
      city: Joi.string().max(50),
      state: Joi.string().max(50),
      pincode: Joi.string().pattern(/^[0-9]{6}$/),
      country: Joi.string(),
    }),
    avatar: Joi.string().uri(),
  }),
  academic: Joi.object({
    year: Joi.number().integer().min(1).max(5),
    semester: Joi.number().integer().min(1).max(10),
    rollNumber: Joi.string().max(20),
    batch: Joi.string().max(20),
    cgpa: Joi.number().min(0).max(10),
  }),
});

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  
  // Auth schemas
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  
  // Course schemas
  courseCreateSchema,
  courseQuerySchema,
  
  // Application schemas
  applicationSchema,
  applicationQuerySchema,
  
  // News schemas
  newsCreateSchema,
  
  // Event schemas
  eventCreateSchema,
  
  // Testimonial schemas
  testimonialCreateSchema,
  
  // Common schemas
  paginationSchema,
  mongoIdSchema,
  
  // Common patterns
  commonPatterns,
};

