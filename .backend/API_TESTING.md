# 🧪 API Testing Guide

Quick test examples for all major endpoints.

## Authentication Tests

### 1. Register New Student
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test.student@bmiet.edu.in",
  "password": "password123",
  "profile": {
    "firstName": "Test",
    "lastName": "Student",
    "phone": "9876543299"
  }
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@bmiet.edu.in",
  "password": "admin123"
}
```

**Save the token from response!**

### 3. Get Profile (Protected)
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

## Course Tests

### 4. Get All Courses
```http
GET http://localhost:5000/api/courses
```

### 5. Get Courses by Department
```http
GET http://localhost:5000/api/courses?department=Computer Science
```

### 6. Search Courses
```http
GET http://localhost:5000/api/courses/search?q=engineering
```

### 7. Calculate Fees
```http
POST http://localhost:5000/api/courses/calculate-fees
Content-Type: application/json

{
  "courseId": "YOUR_COURSE_ID",
  "hostelRequired": true,
  "transportRequired": false
}
```

## Application Tests

### 8. Check Eligibility (Protected)
```http
POST http://localhost:5000/api/applications/check-eligibility
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "courseId": "YOUR_COURSE_ID",
  "tenthPercentage": 75,
  "twelfthPercentage": 80
}
```

### 9. Submit Application (Student Only)
```http
POST http://localhost:5000/api/applications
Authorization: Bearer YOUR_STUDENT_TOKEN
Content-Type: application/json

{
  "courseId": "YOUR_COURSE_ID",
  "personalInfo": {
    "fatherName": "Father Name",
    "motherName": "Mother Name",
    "category": "general"
  },
  "academicRecords": {
    "tenth": {
      "board": "CBSE",
      "school": "ABC School",
      "percentage": 85,
      "yearOfPassing": 2020
    },
    "twelfth": {
      "board": "CBSE",
      "school": "ABC School",
      "stream": "science",
      "percentage": 88,
      "yearOfPassing": 2022
    }
  },
  "personalStatement": "I am passionate about engineering...",
  "preferences": {
    "hostelRequired": true,
    "transportRequired": false,
    "scholarshipInterest": true
  }
}
```

### 10. Get My Applications (Protected)
```http
GET http://localhost:5000/api/applications/my
Authorization: Bearer YOUR_STUDENT_TOKEN
```

## News Tests

### 11. Get All News
```http
GET http://localhost:5000/api/news
```

### 12. Get News by Category
```http
GET http://localhost:5000/api/news?category=Achievements
```

### 13. Get Featured News
```http
GET http://localhost:5000/api/news?featured=true
```

### 14. Get Single News Article
```http
GET http://localhost:5000/api/news/NEWS_ID
```

## Placement Tests

### 15. Get Placement Statistics
```http
GET http://localhost:5000/api/placements/stats
```

### 16. Get All Placements
```http
GET http://localhost:5000/api/placements
```

### 17. Get Top Companies
```http
GET http://localhost:5000/api/placements/companies
```

## Testimonial Tests

### 18. Get All Testimonials
```http
GET http://localhost:5000/api/testimonials
```

### 19. Get Featured Testimonials
```http
GET http://localhost:5000/api/testimonials?featured=true
```

## Event Tests

### 20. Get Upcoming Events
```http
GET http://localhost:5000/api/events?status=upcoming
```

### 21. Register for Event (Protected)
```http
POST http://localhost:5000/api/events/EVENT_ID/register
Authorization: Bearer YOUR_TOKEN
```

## Admin Tests

### 22. Get Admin Dashboard (Admin Only)
```http
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### 23. Create Course (Admin Only)
```http
POST http://localhost:5000/api/admin/courses
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Artificial Intelligence",
  "code": "AI",
  "department": "Computer Science",
  "duration": {
    "years": 4,
    "semesters": 8
  },
  "fees": {
    "tuition": 180000,
    "hostel": 50000,
    "transport": 20000,
    "other": 10000
  },
  "eligibility": [
    {
      "criteria": "12th grade (PCM)",
      "minimumPercentage": 75
    }
  ],
  "seats": {
    "total": 60,
    "available": 60,
    "reserved": {
      "general": 30,
      "obc": 15,
      "sc": 10,
      "st": 5
    }
  },
  "description": "Comprehensive AI program with ML specialization",
  "admissionStatus": "open",
  "popularityScore": 90
}
```

### 24. Get All Applications (Admin)
```http
GET http://localhost:5000/api/admin/applications
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### 25. Update Application Status (Admin)
```http
PUT http://localhost:5000/api/admin/applications/APPLICATION_ID/status
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "status": "accepted",
  "reviewComments": "Excellent academic record. Approved for admission."
}
```

### 26. Create News Article (Admin)
```http
POST http://localhost:5000/api/admin/news
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "New Campus Opening Soon",
  "content": "BMIET is excited to announce the opening of our new campus...",
  "category": "General",
  "tags": ["campus", "announcement"],
  "featured": true,
  "status": "published"
}
```

## 🎯 Testing Workflow

1. **Login as Admin** (Test #2)
2. **Get Courses** (Test #4)
3. **Register as Student** (Test #1)
4. **Login as Student** (Test #2)
5. **Check Eligibility** (Test #8)
6. **Submit Application** (Test #9)
7. **View My Applications** (Test #10)
8. **Login as Admin**
9. **Update Application Status** (Test #25)

## 📝 Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login response
- Replace `YOUR_COURSE_ID` with actual course ID from get courses response
- Replace `NEWS_ID`, `EVENT_ID`, `APPLICATION_ID` with actual IDs
- All timestamps are in ISO format
- Pagination: Add `?page=1&limit=10` to any list endpoint

## 🔧 Using Postman

Import this collection structure or use the examples above. Make sure to:
1. Create an environment variable for `baseUrl`: `http://localhost:5000/api`
2. Create an environment variable for `token` and update it after login
3. Use `{{baseUrl}}` and `{{token}}` in your requests

## ✅ Expected Responses

All successful responses follow this format:
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... },
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

