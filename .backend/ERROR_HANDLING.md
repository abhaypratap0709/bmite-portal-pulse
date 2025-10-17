# 🛠️ Error Handling & Validation Guide

This document outlines the comprehensive error handling and validation system implemented in the BMIET Portal backend.

## 🔧 Error Handling System

### **Global Error Handler**

The global error handler (`middleware/errorHandler.js`) provides consistent error responses across all routes:

```javascript
// Consistent error response format
{
  "success": false,
  "message": "Error description",
  "errorCode": "SPECIFIC_ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/courses",
  "method": "POST",
  "errors": [ // For validation errors
    {
      "field": "email",
      "message": "Email is required",
      "value": ""
    }
  ]
}
```

### **Error Types Handled**

#### **1. Database Errors**
- **CastError**: Invalid MongoDB ObjectId format
- **ValidationError**: Mongoose schema validation failures
- **DuplicateKeyError**: Unique constraint violations
- **MongoNetworkError**: Database connection issues

#### **2. Authentication Errors**
- **JsonWebTokenError**: Invalid JWT tokens
- **TokenExpiredError**: Expired JWT tokens
- **UnauthorizedError**: Missing or invalid credentials

#### **3. Validation Errors**
- **Input Validation**: Joi schema validation failures
- **File Upload Errors**: Multer file size/type restrictions
- **Rate Limiting**: Too many requests

#### **4. Application Errors**
- **Not Found**: Resource doesn't exist
- **Forbidden**: Insufficient permissions
- **Bad Request**: Invalid request data

## 📋 Validation System

### **Joi Validation Middleware**

All input data is validated using Joi schemas with comprehensive rules:

```javascript
// Validation middleware usage
const { validateBody, validateQuery, validateParams } = require('../middleware/validator');

// Body validation
router.post('/courses', validateBody(courseCreateSchema), createCourse);

// Query validation
router.get('/courses', validateQuery(courseQuerySchema), getCourses);

// Parameter validation
router.get('/courses/:id', validateParams(mongoIdSchema), getCourse);
```

### **Validation Features**

#### **1. Data Sanitization**
- **Automatic trimming**: Removes leading/trailing whitespace
- **Type conversion**: Converts strings to numbers/dates
- **Unknown field removal**: Strips unexpected fields
- **Case normalization**: Converts emails to lowercase

#### **2. Comprehensive Rules**
- **Required fields**: Ensures all mandatory data is present
- **Data types**: Validates correct data types
- **Length limits**: Enforces min/max character counts
- **Pattern matching**: Validates formats (email, phone, ObjectId)
- **Enum validation**: Restricts values to predefined options
- **Custom validation**: Complex business logic validation

#### **3. Error Messages**
- **User-friendly**: Clear, actionable error messages
- **Field-specific**: Identifies exact fields with issues
- **Contextual**: Provides current values and constraints

## 🗃️ MongoDB Models Enhancement

### **Enhanced Validation**

All models now include comprehensive validation:

```javascript
// Example: News model validation
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['General', 'Achievements', 'Events', 'Admissions', 'Research', 'Announcements'],
      message: 'Category must be one of: General, Achievements, Events, Admissions, Research, Announcements'
    },
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  validate: {
    validator: function(tags) {
      return tags.length <= 10;
    },
    message: 'Cannot have more than 10 tags'
  }
});
```

### **Database Indexes**

Optimized indexes for better query performance:

```javascript
// Text search indexes
newsSchema.index({ title: 'text', content: 'text' });
eventSchema.index({ title: 'text', description: 'text' });

// Compound indexes for common queries
newsSchema.index({ publishDate: -1, featured: -1 });
applicationSchema.index({ userId: 1, courseId: 1 });
```

## 🚀 Usage Examples

### **1. Route Implementation**

```javascript
// Complete route with validation
const express = require('express');
const router = express.Router();
const { 
  validateBody, 
  validateQuery, 
  validateParams,
  courseCreateSchema,
  courseQuerySchema,
  mongoIdSchema 
} = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

// Protected admin route with validation
router.post('/courses', 
  protect, 
  authorize('admin'), 
  validateBody(courseCreateSchema), 
  createCourse
);

// Public route with query validation
router.get('/courses', 
  validateQuery(courseQuerySchema), 
  getCourses
);

// Route with parameter validation
router.get('/courses/:id', 
  validateParams(mongoIdSchema), 
  getCourse
);
```

### **2. Controller Error Handling**

```javascript
// Controller with proper error handling
exports.createCourse = async (req, res, next) => {
  try {
    // All async operations wrapped in try/catch
    const course = await Course.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    // Pass errors to global handler
    next(error);
  }
};
```

### **3. Validation Response Examples**

#### **Successful Validation**
```javascript
// Input
{
  "name": "Computer Science Engineering",
  "code": "CSE001",
  "department": "Computer Science"
}

// Response (validation passes, continues to controller)
// No response - continues to next middleware
```

#### **Failed Validation**
```javascript
// Input
{
  "name": "CS",
  "code": "",
  "department": "Invalid Department"
}

// Response
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "name",
      "message": "Title must be at least 5 characters",
      "value": "CS"
    },
    {
      "field": "code",
      "message": "Course code is required",
      "value": ""
    },
    {
      "field": "department",
      "message": "Department must be one of: Computer Science, Mechanical, ...",
      "value": "Invalid Department"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🧪 Testing

### **Validation Testing**

Run the comprehensive validation test suite:

```bash
# Test all validation schemas
node test-validation.js

# Test with debug output
DEBUG=1 node test-validation.js
```

### **Error Testing**

Test error scenarios:

```bash
# Test invalid data
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"weak"}'

# Test missing required fields
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Course"}'

# Test invalid ObjectId
curl http://localhost:5000/api/courses/invalid-id
```

## 📊 Error Monitoring

### **Development Mode**

Enhanced logging for development:

```javascript
// Detailed error logging in development
console.error('🔴 Error Details:', {
  name: err.name,
  message: err.message,
  stack: err.stack,
  url: req.originalUrl,
  method: req.method,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString(),
});
```

### **Production Mode**

Clean error responses without sensitive information:

```javascript
// Production error response (no stack traces)
{
  "success": false,
  "message": "Internal server error",
  "errorCode": "INTERNAL_ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/courses",
  "method": "POST"
}
```

## 🔒 Security Considerations

### **Input Sanitization**

1. **XSS Protection**: All user input is sanitized
2. **NoSQL Injection**: MongoDB operators are stripped
3. **Data Validation**: Strict type and format validation
4. **Field Filtering**: Unknown fields are removed

### **Error Information**

1. **No Data Leakage**: Sensitive information is not exposed
2. **Consistent Responses**: Uniform error format
3. **Rate Limiting**: Prevents abuse through error responses
4. **Logging**: Security events are logged for monitoring

## 📈 Performance Optimizations

### **Database Indexes**

- **Query Optimization**: Indexes for common query patterns
- **Text Search**: Full-text search capabilities
- **Compound Indexes**: Multi-field query optimization

### **Validation Performance**

- **Early Validation**: Input validation before processing
- **Efficient Schemas**: Optimized Joi validation rules
- **Caching**: Repeated validation results cached

## 🛠️ Maintenance

### **Adding New Validation**

1. **Define Schema**: Create Joi schema in `validator.js`
2. **Apply Middleware**: Add to routes requiring validation
3. **Test Thoroughly**: Use test script to verify
4. **Document**: Update this guide with new schemas

### **Error Handler Updates**

1. **New Error Types**: Add handlers for new error scenarios
2. **Response Format**: Maintain consistent response structure
3. **Logging**: Ensure proper error logging
4. **Testing**: Verify error handling works correctly

## 📞 Support

For issues with error handling or validation:

1. **Check Logs**: Review server logs for detailed error information
2. **Test Validation**: Use the test script to verify schemas
3. **Review Documentation**: Check this guide for implementation details
4. **Contact Team**: Reach out for complex error scenarios

---

**Note**: This error handling system ensures consistent, secure, and user-friendly error responses while providing developers with detailed information for debugging and maintenance.
