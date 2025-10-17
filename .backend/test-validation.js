#!/usr/bin/env node

/**
 * Test script for validation and error handling
 * Run with: node test-validation.js
 */

const Joi = require('joi');
const { 
  registerSchema, 
  loginSchema, 
  courseCreateSchema,
  applicationSchema,
  newsCreateSchema,
  eventCreateSchema,
  testimonialCreateSchema,
  mongoIdSchema,
  commonPatterns
} = require('./middleware/validator');

console.log('🧪 Testing Validation Schemas...\n');

// Test data
const testData = {
  validUser: {
    email: 'test@example.com',
    password: 'SecurePass123!',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      dateOfBirth: '1995-01-01',
      gender: 'male'
    },
    role: 'student'
  },
  
  invalidUser: {
    email: 'invalid-email',
    password: 'weak',
    profile: {
      firstName: 'A',
      lastName: '',
      phone: '123',
      dateOfBirth: '2025-01-01'
    }
  },

  validCourse: {
    name: 'Computer Science Engineering',
    code: 'CSE001',
    department: 'Computer Science',
    duration: {
      years: 4,
      semesters: 8
    },
    fees: {
      tuition: 100000,
      hostel: 50000,
      transport: 10000,
      other: 5000
    },
    eligibility: [
      {
        criteria: '12th grade',
        minimumPercentage: 75
      }
    ],
    seats: {
      total: 60,
      available: 60
    },
    description: 'A comprehensive computer science engineering program covering software development, algorithms, data structures, and modern technologies.',
    highlights: ['Industry-relevant curriculum', 'Expert faculty'],
    prerequisites: ['Mathematics', 'Physics', 'Chemistry']
  },

  validApplication: {
    courseId: '507f1f77bcf86cd799439011',
    personalInfo: {
      fatherName: 'Robert Doe',
      motherName: 'Jane Doe',
      category: 'general',
      nationality: 'Indian'
    },
    academicRecords: {
      tenth: {
        board: 'CBSE',
        school: 'ABC School',
        percentage: 85,
        yearOfPassing: 2018
      },
      twelfth: {
        board: 'CBSE',
        school: 'XYZ College',
        stream: 'science',
        percentage: 80,
        yearOfPassing: 2020
      }
    },
    personalStatement: 'I am passionate about computer science and want to pursue engineering.',
    preferences: {
      hostelRequired: true,
      transportRequired: false,
      scholarshipInterest: true
    }
  },

  validNews: {
    title: 'BMIET Achieves 100% Placement Record',
    content: 'We are proud to announce that BMIET has achieved a remarkable 100% placement record for the current academic year. All eligible students have been successfully placed in top companies with excellent packages.',
    category: 'Achievements',
    tags: ['placement', 'achievement', 'success'],
    featured: true,
    status: 'published'
  },

  validEvent: {
    title: 'Tech Symposium 2024',
    description: 'Annual technology symposium featuring industry experts and innovative projects.',
    eventType: 'conference',
    startDate: '2024-06-15T09:00:00Z',
    endDate: '2024-06-15T17:00:00Z',
    venue: {
      location: 'Main Auditorium',
      room: 'A101',
      capacity: 200
    },
    organizerName: 'Dr. Smith',
    department: 'Computer Science',
    registrationRequired: true,
    registrationDeadline: '2024-06-10T23:59:59Z',
    registrationFee: 500,
    maxParticipants: 150,
    status: 'upcoming',
    isPublic: true
  },

  validTestimonial: {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Tech Corp',
    batch: '2020',
    content: 'BMIET provided me with excellent education and practical skills that helped me land my dream job. The faculty is supportive and the curriculum is industry-relevant.',
    rating: 5,
    isApproved: true,
    isFeatured: true,
    order: 1
  },

  validMongoId: {
    id: '507f1f77bcf86cd799439011'
  }
};

// Test function
function testSchema(schema, data, testName) {
  console.log(`📋 Testing ${testName}:`);
  
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    console.log('❌ Validation failed:');
    error.details.forEach(detail => {
      console.log(`   - ${detail.path.join('.')}: ${detail.message}`);
    });
  } else {
    console.log('✅ Validation passed');
    if (process.env.DEBUG) {
      console.log('   Sanitized data:', JSON.stringify(value, null, 2));
    }
  }
  console.log('');
}

// Run tests
console.log('=== VALID DATA TESTS ===\n');

testSchema(registerSchema, testData.validUser, 'User Registration (Valid)');
testSchema(loginSchema, { email: 'test@example.com', password: 'SecurePass123!' }, 'User Login (Valid)');
testSchema(courseCreateSchema, testData.validCourse, 'Course Creation (Valid)');
testSchema(applicationSchema, testData.validApplication, 'Application Submission (Valid)');
testSchema(newsCreateSchema, testData.validNews, 'News Creation (Valid)');
testSchema(eventCreateSchema, testData.validEvent, 'Event Creation (Valid)');
testSchema(testimonialCreateSchema, testData.validTestimonial, 'Testimonial Creation (Valid)');
testSchema(mongoIdSchema, testData.validMongoId, 'MongoDB ObjectId (Valid)');

console.log('=== INVALID DATA TESTS ===\n');

testSchema(registerSchema, testData.invalidUser, 'User Registration (Invalid)');

// Test invalid course data
const invalidCourse = {
  ...testData.validCourse,
  name: 'A', // Too short
  code: '', // Empty
  department: 'Invalid Department', // Not in enum
  fees: {
    tuition: -1000 // Negative value
  }
};
testSchema(courseCreateSchema, invalidCourse, 'Course Creation (Invalid)');

// Test invalid application data
const invalidApplication = {
  ...testData.validApplication,
  courseId: 'invalid-id', // Invalid ObjectId
  personalInfo: {
    fatherName: '', // Empty
    motherName: 'A', // Too short
    category: 'invalid' // Not in enum
  },
  academicRecords: {
    tenth: {
      percentage: 150 // Invalid percentage
    }
  }
};
testSchema(applicationSchema, invalidApplication, 'Application Submission (Invalid)');

// Test invalid news data
const invalidNews = {
  title: 'Short', // Too short
  content: 'Too short content', // Too short
  category: 'Invalid Category', // Not in enum
  tags: Array(15).fill('tag') // Too many tags
};
testSchema(newsCreateSchema, invalidNews, 'News Creation (Invalid)');

console.log('=== EDGE CASES ===\n');

// Test with missing required fields
testSchema(registerSchema, {}, 'User Registration (Missing Fields)');
testSchema(courseCreateSchema, { name: 'Test Course' }, 'Course Creation (Missing Fields)');

// Test with extra fields (should be stripped)
const courseWithExtraFields = {
  ...testData.validCourse,
  extraField: 'should be removed',
  anotherField: 123
};
testSchema(courseCreateSchema, courseWithExtraFields, 'Course Creation (Extra Fields)');

console.log('=== COMMON PATTERNS TESTS ===\n');

// Test ObjectId pattern
const objectIdTests = [
  { id: '507f1f77bcf86cd799439011', valid: true },
  { id: 'invalid-id', valid: false },
  { id: '507f1f77bcf86cd79943901', valid: false }, // Too short
  { id: '507f1f77bcf86cd799439011a', valid: false }, // Too long
  { id: '507f1f77bcf86cd79943901g', valid: false } // Invalid character
];

objectIdTests.forEach(test => {
  const { error } = commonPatterns.objectId.validate(test.id);
  const isValid = !error;
  console.log(`${isValid === test.valid ? '✅' : '❌'} ObjectId "${test.id}": ${isValid ? 'Valid' : 'Invalid'}`);
});

// Test email pattern
const emailTests = [
  'test@example.com',
  'user.name@domain.co.uk',
  'invalid-email',
  '@domain.com',
  'user@'
];

emailTests.forEach(email => {
  const { error } = commonPatterns.email.validate(email);
  console.log(`${!error ? '✅' : '❌'} Email "${email}": ${!error ? 'Valid' : 'Invalid'}`);
});

// Test password pattern
const passwordTests = [
  'SecurePass123!',
  'weak',
  'NoNumbers!',
  'nouppercase123!',
  'NoSpecialChars123'
];

passwordTests.forEach(password => {
  const { error } = commonPatterns.password.validate(password);
  console.log(`${!error ? '✅' : '❌'} Password: ${!error ? 'Valid' : 'Invalid'}`);
});

console.log('\n🎉 Validation testing completed!');
console.log('\n💡 Tips:');
console.log('   - Set DEBUG=1 to see sanitized data output');
console.log('   - All validation schemas include proper error messages');
console.log('   - Extra fields are automatically stripped');
console.log('   - Data is converted to appropriate types when possible');
