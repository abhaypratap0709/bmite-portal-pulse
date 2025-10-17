const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging in development mode
  if (process.env.NODE_ENV === 'development') {
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
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    error = { 
      message, 
      statusCode: 400,
      errorCode: 'INVALID_ID_FORMAT'
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error = { 
      message, 
      statusCode: 409,
      errorCode: 'DUPLICATE_ENTRY',
      field,
      value
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    error = { 
      message: 'Validation failed', 
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
      errors: validationErrors
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authentication token';
    error = { 
      message, 
      statusCode: 401,
      errorCode: 'INVALID_TOKEN'
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Authentication token has expired';
    error = { 
      message, 
      statusCode: 401,
      errorCode: 'TOKEN_EXPIRED'
    };
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    error = { 
      message, 
      statusCode: 413,
      errorCode: 'FILE_TOO_LARGE'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = { 
      message, 
      statusCode: 400,
      errorCode: 'UNEXPECTED_FILE'
    };
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    const message = 'Too many requests, please try again later';
    error = { 
      message, 
      statusCode: 429,
      errorCode: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.retryAfter
    };
  }

  // Syntax errors (malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'Invalid JSON format in request body';
    error = { 
      message, 
      statusCode: 400,
      errorCode: 'INVALID_JSON'
    };
  }

  // Database connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    const message = 'Database connection error. Please try again later';
    error = { 
      message, 
      statusCode: 503,
      errorCode: 'DATABASE_ERROR'
    };
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal server error',
    ...(error.errorCode && { errorCode: error.errorCode }),
    ...(error.errors && { errors: error.errors }),
    ...(error.field && { field: error.field }),
    ...(error.value && { value: error.value }),
    ...(error.retryAfter && { retryAfter: error.retryAfter }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

