require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Course = require('../models/Course.model');
const News = require('../models/News.model');
const Placement = require('../models/Placement.model');
const Testimonial = require('../models/Testimonial.model');
const Event = require('../models/Event.model');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await News.deleteMany({});
    await Placement.deleteMany({});
    await Testimonial.deleteMany({});
    await Event.deleteMany({});

    console.log('Existing data cleared');

    // Create Admin User
    const admin = await User.create({
      email: 'admin@bmiet.edu.in',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        phone: '9876543210',
      },
    });

    // Create Sample Students
    const students = await User.create([
      {
        email: 'rahul.sharma@bmiet.edu.in',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Rahul',
          lastName: 'Sharma',
          phone: '9876543211',
          gender: 'male',
        },
      },
      {
        email: 'priya.patel@bmiet.edu.in',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Priya',
          lastName: 'Patel',
          phone: '9876543212',
          gender: 'female',
        },
      },
    ]);

    console.log('Users created');

    // Create Courses
    const courses = await Course.create([
      {
        name: 'Computer Science Engineering',
        code: 'CSE',
        department: 'Computer Science',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 150000,
          hostel: 50000,
          transport: 20000,
          other: 10000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 70 },
        ],
        seats: {
          total: 120,
          available: 80,
          reserved: { general: 60, obc: 30, sc: 20, st: 10 },
        },
        description:
          'Master the fundamentals of computing, AI, and software development. Our CSE program prepares you for careers in tech giants.',
        highlights: [
          'Industry-relevant curriculum',
          'AI/ML specialization',
          'Top placement record',
          'Modern labs and infrastructure',
        ],
        admissionStatus: 'open',
        popularityScore: 95,
      },
      {
        name: 'Mechanical Engineering',
        code: 'MECH',
        department: 'Mechanical',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 120000,
          hostel: 50000,
          transport: 20000,
          other: 10000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 65 },
        ],
        seats: {
          total: 90,
          available: 60,
          reserved: { general: 45, obc: 25, sc: 15, st: 5 },
        },
        description: 'Design, analyze and manufacture innovative mechanical systems.',
        highlights: ['CAD/CAM training', 'Industry partnerships', 'Modern workshops'],
        admissionStatus: 'open',
        popularityScore: 75,
      },
      {
        name: 'Electronics & Communication Engineering',
        code: 'ECE',
        department: 'Electronics & Communication',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 130000,
          hostel: 50000,
          transport: 20000,
          other: 10000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 70 },
        ],
        seats: {
          total: 60,
          available: 40,
          reserved: { general: 30, obc: 15, sc: 10, st: 5 },
        },
        description: 'Explore cutting-edge electronics and communication technologies.',
        highlights: ['VLSI design', '5G technology', 'IoT specialization'],
        admissionStatus: 'open',
        popularityScore: 85,
      },
      {
        name: 'Civil Engineering',
        code: 'CIVIL',
        department: 'Civil',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 110000,
          hostel: 50000,
          transport: 20000,
          other: 10000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 55 },
          { criteria: '12th grade (PCM)', minimumPercentage: 60 },
        ],
        seats: {
          total: 60,
          available: 50,
          reserved: { general: 30, obc: 15, sc: 10, st: 5 },
        },
        description: 'Build the infrastructure of tomorrow with sustainable design.',
        highlights: ['Site visits', 'Sustainable construction', 'Government projects'],
        admissionStatus: 'open',
        popularityScore: 65,
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        department: 'Electrical',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 120000,
          hostel: 50000,
          transport: 20000,
          other: 10000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 65 },
        ],
        seats: {
          total: 60,
          available: 45,
          reserved: { general: 30, obc: 15, sc: 10, st: 5 },
        },
        description: 'Study power systems, renewable energy, and electrical machines.',
        highlights: ['Power systems lab', 'Renewable energy focus', 'Smart grid technology'],
        admissionStatus: 'open',
        popularityScore: 70,
      },
    ]);

    console.log('Courses created');

    // Create News Articles
    const newsArticles = await News.create([
      {
        title: 'BMIET Students Win National Hackathon 2024',
        content:
          'Our Computer Science students secured first place at the National Innovation Challenge competing against 200+ teams from across India. The team developed an AI-powered educational platform.',
        category: 'Achievements',
        author: admin._id,
        authorName: 'Admin User',
        publishDate: new Date('2024-03-15'),
        tags: ['hackathon', 'achievement', 'AI'],
        featured: true,
        status: 'published',
        views: 1250,
        likes: 89,
      },
      {
        title: 'New AI Research Lab Inaugurated',
        content:
          'BMIET inaugurates state-of-the-art Artificial Intelligence and Machine Learning research facility equipped with latest GPU clusters and research tools.',
        category: 'Research',
        author: admin._id,
        authorName: 'Admin User',
        publishDate: new Date('2024-03-10'),
        tags: ['AI', 'research', 'infrastructure'],
        featured: true,
        status: 'published',
        views: 890,
        likes: 67,
      },
      {
        title: 'Admission Process for 2024-25 Begins',
        content:
          'Applications are now open for all undergraduate and postgraduate programs. Early bird discounts available for applications submitted before April 30th.',
        category: 'Admissions',
        author: admin._id,
        authorName: 'Admin User',
        publishDate: new Date('2024-03-08'),
        tags: ['admissions', 'announcement'],
        featured: false,
        status: 'published',
        views: 2340,
        likes: 145,
      },
      {
        title: 'Annual Tech Fest "Innovate 2024"',
        content:
          'Three-day technical festival featuring workshops on cloud computing, IoT, blockchain, competitions worth ₹5 lakhs in prizes, and guest lectures from industry experts.',
        category: 'Events',
        author: admin._id,
        authorName: 'Admin User',
        publishDate: new Date('2024-03-05'),
        tags: ['techfest', 'events', 'competitions'],
        featured: false,
        status: 'published',
        views: 1670,
        likes: 234,
      },
      {
        title: 'Partnership with Leading Tech Companies',
        content:
          'BMIET signs MoUs with TCS, Infosys, and Amazon for industry collaboration, internships, and placement opportunities for students.',
        category: 'Achievements',
        author: admin._id,
        authorName: 'Admin User',
        publishDate: new Date('2024-03-01'),
        tags: ['partnership', 'placements', 'industry'],
        featured: false,
        status: 'published',
        views: 1120,
        likes: 98,
      },
      {
        title: 'Guest Lecture on Future of Technology',
        content:
          'Renowned AI researcher Dr. Priya Sharma will deliver keynote on "The Future of Artificial Intelligence in India" on March 25th.',
        category: 'Events',
        author: admin._id,
        authorName: 'Admin User',
        publishDate: new Date('2024-02-28'),
        tags: ['guest-lecture', 'AI', 'events'],
        featured: false,
        status: 'published',
        views: 560,
        likes: 45,
      },
    ]);

    console.log('News articles created');

    // Create Placements
    const placements = await Placement.create([
      {
        studentId: students[0]._id,
        companyName: 'Google',
        jobRole: 'Software Engineer',
        jobType: 'full-time',
        packageOffered: 4500000,
        packageType: 'CTC',
        placementDate: new Date('2024-02-15'),
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2024',
        status: 'accepted',
      },
      {
        studentId: students[1]._id,
        companyName: 'Tesla',
        jobRole: 'Mechanical Engineer',
        jobType: 'full-time',
        packageOffered: 2800000,
        packageType: 'CTC',
        placementDate: new Date('2024-01-20'),
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        sector: 'Core Engineering',
        courseId: courses[1]._id,
        batch: '2024',
        status: 'joined',
      },
      {
        studentId: students[0]._id,
        companyName: 'Amazon',
        jobRole: 'Data Scientist',
        jobType: 'full-time',
        packageOffered: 3200000,
        packageType: 'CTC',
        placementDate: new Date('2023-12-10'),
        location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2023',
        status: 'joined',
      },
      {
        studentId: students[1]._id,
        companyName: 'TCS',
        jobRole: 'Software Developer',
        jobType: 'full-time',
        packageOffered: 800000,
        packageType: 'CTC',
        placementDate: new Date('2023-11-15'),
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2023',
        status: 'joined',
      },
      {
        studentId: students[0]._id,
        companyName: 'Infosys',
        jobRole: 'System Engineer',
        jobType: 'full-time',
        packageOffered: 750000,
        packageType: 'CTC',
        placementDate: new Date('2022-12-05'),
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2022',
        status: 'joined',
      },
    ]);

    console.log('Placements created');

    // Create Testimonials
    const testimonials = await Testimonial.create([
      {
        userId: students[0]._id,
        name: 'Rahul Sharma',
        role: 'Software Engineer at Google',
        company: 'Google',
        batch: 'Class of 2022',
        content:
          'BMIET provided me with the perfect blend of theoretical knowledge and practical skills. The faculty guidance and infrastructure prepared me well for my career in tech.',
        rating: 5,
        isApproved: true,
        isFeatured: true,
        order: 1,
      },
      {
        userId: students[1]._id,
        name: 'Priya Patel',
        role: 'Mechanical Engineer at Tesla',
        company: 'Tesla',
        batch: 'Class of 2021',
        content:
          'The hands-on projects and industry exposure at BMIET were invaluable. The placement cell worked tirelessly to ensure we got opportunities at top companies.',
        rating: 5,
        isApproved: true,
        isFeatured: true,
        order: 2,
      },
      {
        name: 'Amit Kumar',
        role: 'Data Scientist at Amazon',
        company: 'Amazon',
        batch: 'Class of 2023',
        content:
          "BMIET's focus on emerging technologies like AI and ML gave me a competitive edge. The research opportunities and mentorship I received were exceptional.",
        rating: 5,
        isApproved: true,
        isFeatured: true,
        order: 3,
      },
      {
        name: 'Sneha Reddy',
        role: 'Civil Engineer at L&T',
        company: 'L&T',
        batch: 'Class of 2020',
        content:
          'The infrastructure design projects and industry visits organized by BMIET gave me real-world experience that proved invaluable in my career.',
        rating: 4,
        isApproved: true,
        isFeatured: true,
        order: 4,
      },
    ]);

    console.log('Testimonials created');

    // Create Events
    const events = await Event.create([
      {
        title: 'Tech Fest 2024 - Innovate',
        description:
          'Annual technical festival with workshops, hackathons, coding competitions, and guest lectures from industry experts.',
        eventType: 'fest',
        startDate: new Date('2024-04-15'),
        endDate: new Date('2024-04-17'),
        venue: { location: 'BMIET Campus', room: 'Main Auditorium', capacity: 500 },
        organizer: admin._id,
        organizerName: 'Student Council',
        department: 'Computer Science',
        registrationRequired: true,
        registrationDeadline: new Date('2024-04-10'),
        registrationFee: 500,
        maxParticipants: 500,
        status: 'upcoming',
        isPublic: true,
      },
      {
        title: 'Workshop on Cloud Computing',
        description:
          'Hands-on workshop on AWS and Azure cloud services. Learn to deploy applications on cloud infrastructure.',
        eventType: 'workshop',
        startDate: new Date('2024-03-25'),
        endDate: new Date('2024-03-25'),
        venue: { location: 'BMIET Campus', room: 'Lab 301', capacity: 50 },
        organizer: admin._id,
        organizerName: 'CS Department',
        department: 'Computer Science',
        registrationRequired: true,
        registrationDeadline: new Date('2024-03-20'),
        registrationFee: 0,
        maxParticipants: 50,
        status: 'upcoming',
        isPublic: true,
      },
      {
        title: 'Placement Drive - TCS',
        description: 'On-campus placement drive for TCS. All eligible students can participate.',
        eventType: 'other',
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-04-05'),
        venue: { location: 'BMIET Campus', room: 'Auditorium', capacity: 200 },
        organizer: admin._id,
        organizerName: 'Placement Cell',
        registrationRequired: true,
        registrationDeadline: new Date('2024-04-01'),
        registrationFee: 0,
        maxParticipants: 200,
        status: 'upcoming',
        isPublic: false,
      },
    ]);

    console.log('Events created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Sample Credentials:');
    console.log('Admin - Email: admin@bmiet.edu.in, Password: admin123');
    console.log('Student - Email: rahul.sharma@bmiet.edu.in, Password: student123');
    console.log('Student - Email: priya.patel@bmiet.edu.in, Password: student123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

