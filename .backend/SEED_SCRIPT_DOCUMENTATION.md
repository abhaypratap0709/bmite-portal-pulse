# 🌱 BMIET Portal Seed Script Documentation

This document provides comprehensive information about the database seeding script for the BMIET Portal backend.

## 📋 Overview

The seed script (`seeders/seed.js`) populates the MongoDB database with realistic sample data for testing and demonstration purposes. It includes comprehensive data for all major entities in the system.

## 🚀 Usage

### Running the Seed Script

```bash
# Navigate to backend directory
cd .backend

# Run the seed script
npm run seed
```

### Prerequisites

1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **Environment Variables**: Make sure `.env` file contains:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bmiet-portal
   NODE_ENV=development
   ```

## 📊 Seeded Data

### 👥 Users (5 total)

#### Admin User
- **Email**: `admin@bmiet.edu.in`
- **Password**: `admin123`
- **Role**: `admin`
- **Profile**: Dr. Rajesh Kumar (Principal)
- **Academic**: Ph.D. in Computer Science, 15 years experience

#### Faculty User
- **Email**: `faculty@bmiet.edu.in`
- **Password**: `faculty123`
- **Role**: `faculty`
- **Profile**: Dr. Priya Sharma (Professor)
- **Academic**: Ph.D. in Electronics Engineering, 12 years experience

#### Student Users (3)
1. **Rahul Sharma** - `rahul.sharma@bmiet.edu.in` / `student123`
   - 3rd year, 6th semester, CSE
   - Roll Number: BMIET2022001
   - CGPA: 8.5

2. **Priya Patel** - `priya.patel@bmiet.edu.in` / `student123`
   - 2nd year, 4th semester, CSE
   - Roll Number: BMIET2023002
   - CGPA: 9.2

3. **Arjun Singh** - `arjun.singh@bmiet.edu.in` / `student123`
   - 4th year, 8th semester, CSE
   - Roll Number: BMIET2021003
   - CGPA: 8.8

### 📚 Courses (7 programs)

1. **Computer Science Engineering (CSE)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,80,000 total
   - Seats: 120 total, 45 available
   - Placement Rate: 95%

2. **Information Technology (IT)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,80,000 total
   - Seats: 60 total, 20 available
   - Placement Rate: 92%

3. **Electronics & Communication Engineering (ECE)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,80,000 total
   - Seats: 60 total, 25 available
   - Placement Rate: 90%

4. **Mechanical Engineering (MECH)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,60,000 total
   - Seats: 90 total, 35 available
   - Placement Rate: 85%

5. **Electrical Engineering (EE)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,60,000 total
   - Seats: 60 total, 30 available
   - Placement Rate: 87%

6. **Civil Engineering (CIVIL)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,60,000 total
   - Seats: 60 total, 40 available
   - Placement Rate: 80%

7. **Aerospace Engineering (AE)**
   - Duration: 4 years, 8 semesters
   - Fees: ₹2,90,000 total
   - Seats: 30 total, 15 available
   - Placement Rate: 88%

### 📰 News Articles (6 articles)

1. **BMIET Students Win National Hackathon 2024** (Featured)
   - Category: Achievements
   - Views: 2,847, Likes: 156

2. **BMIET Inaugurates State-of-the-Art AI & ML Research Laboratory** (Featured)
   - Category: Research
   - Views: 1,456, Likes: 98

3. **Admissions Open for 2024-25 Academic Year**
   - Category: Admissions
   - Views: 3,421, Likes: 187

4. **Annual Tech Fest "Innovate 2024"**
   - Category: Events
   - Views: 2,156, Likes: 298

5. **BMIET Signs Strategic Partnerships with Leading Tech Companies**
   - Category: Achievements
   - Views: 1,876, Likes: 134

6. **Guest Lecture: "The Future of Artificial Intelligence in India"**
   - Category: Events
   - Views: 892, Likes: 67

### 🎯 Placements (8 records)

1. **Rahul Sharma** → Google (Software Engineer) - ₹45 LPA
2. **Priya Patel** → Tesla (Mechanical Engineer) - ₹32 LPA
3. **Arjun Singh** → Amazon (Data Scientist) - ₹38 LPA
4. **Rahul Sharma** → Microsoft (Software Developer) - ₹28 LPA
5. **Priya Patel** → TCS (Software Developer) - ₹8.5 LPA
6. **Arjun Singh** → Infosys (System Engineer) - ₹7.5 LPA
7. **Rahul Sharma** → Adobe (Frontend Developer) - ₹22 LPA
8. **Priya Patel** → Intel (Hardware Engineer) - ₹18 LPA

### 💬 Testimonials (10 testimonials)

1. **Rahul Sharma** (Google) - 5 stars
2. **Priya Patel** (Tesla) - 5 stars
3. **Arjun Singh** (Amazon) - 5 stars
4. **Sneha Reddy** (L&T) - 4 stars
5. **Vikram Mehta** (Microsoft) - 5 stars
6. **Ananya Gupta** (Intel) - 5 stars
7. **Rajesh Kumar** (NTPC) - 4 stars
8. **Deepika Sharma** (IBM) - 5 stars
9. **Karan Malhotra** (ISRO) - 5 stars
10. **Pooja Agarwal** (Adobe) - 5 stars

### 📅 Events (8 events)

1. **Tech Fest 2024 - Innovate** (Fest)
2. **Workshop on Cloud Computing & DevOps** (Workshop)
3. **Placement Drive - TCS** (Placement)
4. **AI & Machine Learning Conference 2024** (Conference)
5. **Robotics Competition - RoboTech 2024** (Competition)
6. **Cybersecurity Workshop** (Workshop)
7. **Industry Expert Seminar - Future of Technology** (Seminar)
8. **Placement Drive - Amazon** (Placement)

## 🔒 Duplicate Prevention

The seed script includes intelligent duplicate prevention:

- **Checks Existing Data**: Before seeding, it checks if data already exists
- **Safe Re-runs**: Can be run multiple times without creating duplicates
- **Data Count Display**: Shows current data counts when re-run
- **Credential Display**: Always shows current test credentials

### Re-seeding with Fresh Data

To clear existing data and seed fresh:

```bash
# Option 1: Clear database in MongoDB
mongo
use bmiet-portal
db.dropDatabase()

# Option 2: Clear specific collections
db.users.deleteMany({})
db.courses.deleteMany({})
# ... repeat for other collections

# Then run seed script
npm run seed
```

## 🎯 Key Features

### ✅ Realistic Data
- **Proper Relationships**: All entities are properly linked
- **Realistic Values**: Fees, salaries, dates, and other data are realistic
- **Indian Context**: All data is relevant to Indian engineering education

### ✅ Comprehensive Coverage
- **All User Roles**: Admin, faculty, and student accounts
- **Multiple Courses**: 7 different engineering programs
- **Diverse Content**: News, events, placements, testimonials
- **Rich Metadata**: Tags, categories, ratings, and detailed descriptions

### ✅ Production-Ready
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: All data follows model validation rules
- **Performance**: Efficient database operations
- **Safety**: Duplicate prevention and safe re-runs

## 🔧 Technical Details

### Dependencies
- **Mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **bcryptjs**: Password hashing (handled by User model)

### Database Operations
- **Connection**: Connects to MongoDB using environment variables
- **Validation**: All data follows Mongoose schema validation
- **Relationships**: Proper ObjectId references between collections
- **Indexing**: Optimized for query performance

### Error Handling
- **Connection Errors**: Graceful handling of MongoDB connection issues
- **Validation Errors**: Detailed error messages for data validation failures
- **Process Management**: Proper process exit codes and cleanup

## 📝 Testing

### Manual Testing
1. **Run Seed Script**: `npm run seed`
2. **Verify Data**: Check MongoDB for seeded data
3. **Test Login**: Use provided credentials to test authentication
4. **Test APIs**: Use seeded data to test various API endpoints

### Automated Testing
The seed script can be integrated into test suites:
```javascript
// Example test setup
beforeAll(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await clearDatabase();
});
```

## 🚀 Demo Usage

### For Competitions/Demos
1. **Run Seed Script**: `npm run seed`
2. **Use Test Credentials**: 
   - Admin: `admin@bmiet.edu.in` / `admin123`
   - Student: `rahul.sharma@bmiet.edu.in` / `student123`
3. **Showcase Features**: 
   - Student portal with real data
   - Admin panel with comprehensive data
   - Course listings with realistic information
   - News and events with rich content

### For Development
1. **Local Development**: Use seeded data for frontend development
2. **API Testing**: Test all endpoints with realistic data
3. **Feature Development**: Build new features with existing data
4. **Integration Testing**: Test complete user flows

## 📊 Data Statistics

After seeding, the database contains:
- **5 Users** (1 admin, 1 faculty, 3 students)
- **7 Courses** (all major engineering programs)
- **6 News Articles** (comprehensive content)
- **8 Placement Records** (realistic company data)
- **10 Testimonials** (alumni feedback)
- **8 Events** (upcoming activities)

## 🔄 Maintenance

### Updating Data
To add new data or modify existing:
1. Edit `seeders/seed.js`
2. Clear existing data (if needed)
3. Run seed script again

### Adding New Entities
1. Create new data arrays in seed script
2. Add creation logic with proper relationships
3. Update success message and documentation

## 🎉 Success!

The seed script is now ready for use. It provides a comprehensive, realistic dataset that showcases all features of the BMIET Portal system. The duplicate prevention ensures safe operation, and the detailed logging provides clear feedback about the seeding process.

**Happy coding and demoing!** 🚀
