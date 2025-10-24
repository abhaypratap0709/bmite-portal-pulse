require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Course = require('../models/Course.model');
const Application = require('../models/Application.model');
const News = require('../models/News.model');
const Placement = require('../models/Placement.model');
const Testimonial = require('../models/Testimonial.model');
const Event = require('../models/Event.model');
const Announcement = require('../models/Announcement.model');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected for seeding'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Check if data already exists to avoid duplicates
    const existingUsers = await User.countDocuments();
    const existingCourses = await Course.countDocuments();
    
    if (existingUsers > 0 || existingCourses > 0) {
      console.log('⚠️  Database already contains data.');
      console.log('📊 Current data count:');
      console.log(`   Users: ${existingUsers}`);
      console.log(`   Courses: ${existingCourses}`);
      console.log(`   News: ${await News.countDocuments()}`);
      console.log(`   Placements: ${await Placement.countDocuments()}`);
      console.log(`   Testimonials: ${await Testimonial.countDocuments()}`);
      console.log(`   Events: ${await Event.countDocuments()}`);
      
      console.log('\n🔄 To reseed with fresh data, clear the database first.');
      console.log('💡 Use: db.dropDatabase() in MongoDB or delete collections manually.\n');
      
      // Still show existing credentials for testing
      const adminUser = await User.findOne({ role: 'admin' });
      const studentUsers = await User.find({ role: 'student' }).limit(2);
      
      console.log('📝 Current Test Credentials:');
      if (adminUser) {
        console.log(`Admin - Email: ${adminUser.email}, Password: admin123`);
      }
      studentUsers.forEach((student, index) => {
        console.log(`Student ${index + 1} - Email: ${student.email}, Password: student123`);
      });
      
      process.exit(0);
    }

    console.log('🗑️  Database is empty, proceeding with seeding...\n');

    // Create Admin User
    const admin = await User.create({
      email: 'admin@bmiet.edu.in',
      password: 'admin123',
      role: 'admin',
      profile: {
        firstName: 'Dr. Rajesh',
        lastName: 'Kumar',
        phone: '9876543210',
        gender: 'male',
        dateOfBirth: new Date('1980-05-15'),
        address: {
          street: '123 College Road',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        }
      },
      academic: {
        qualification: 'Ph.D. in Computer Science',
        experience: '15 years',
        designation: 'Principal'
      }
    });

    // Create Faculty User
    const faculty = await User.create({
      email: 'faculty@bmiet.edu.in',
      password: 'faculty123',
      role: 'faculty',
      profile: {
        firstName: 'Dr. Priya',
        lastName: 'Sharma',
        phone: '9876543211',
        gender: 'female',
        dateOfBirth: new Date('1985-08-22'),
        address: {
          street: '456 Faculty Colony',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110002',
          country: 'India'
        }
      },
      academic: {
        qualification: 'Ph.D. in Electronics Engineering',
        experience: '12 years',
        designation: 'Professor'
      }
    });

    // Create Sample Students with realistic data
    const students = await User.create([
      {
        email: 'rahul.sharma@bmiet.edu.in',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Rahul',
          lastName: 'Sharma',
          phone: '9876543212',
          gender: 'male',
          dateOfBirth: new Date('2002-03-15'),
          address: {
            street: '789 Student Hostel Block A',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110003',
            country: 'India'
          }
        },
        academic: {
          year: 3,
          semester: 6,
          rollNumber: 'BMIET2022001',
          batch: '2022-26',
          cgpa: 8.5
        }
      },
      {
        email: 'priya.patel@bmiet.edu.in',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Priya',
          lastName: 'Patel',
          phone: '9876543213',
          gender: 'female',
          dateOfBirth: new Date('2003-07-20'),
          address: {
            street: '456 Student Hostel Block B',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110004',
            country: 'India'
          }
        },
        academic: {
          year: 2,
          semester: 4,
          rollNumber: 'BMIET2023002',
          batch: '2023-27',
          cgpa: 9.2
        }
      },
      {
        email: 'arjun.singh@bmiet.edu.in',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'Arjun',
          lastName: 'Singh',
          phone: '9876543214',
          gender: 'male',
          dateOfBirth: new Date('2002-11-10'),
          address: {
            street: '321 Student Hostel Block C',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110005',
            country: 'India'
          }
        },
        academic: {
          year: 4,
          semester: 8,
          rollNumber: 'BMIET2021003',
          batch: '2021-25',
          cgpa: 8.8
        }
      }
    ]);

    console.log('👥 Users created');

    // Create Courses with comprehensive data
    const courses = await Course.create([
      {
        name: 'Computer Science Engineering',
        code: 'CSE',
        department: 'Computer Science',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 180000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 75 },
          { criteria: 'JEE Main Score', minimumPercentage: 85 }
        ],
        seats: {
          total: 120,
          available: 45,
          reserved: { general: 60, obc: 32, sc: 18, st: 10 },
        },
        description:
          'Master the fundamentals of computing, artificial intelligence, machine learning, and software development. Our CSE program is designed to prepare students for careers in top-tier tech companies, startups, and research organizations. The curriculum includes hands-on projects, industry internships, and cutting-edge research opportunities.',
        highlights: [
          'AI/ML specialization tracks',
          'Industry partnerships with Google, Microsoft, Amazon',
          '95% placement rate with average package ₹12 LPA',
          'State-of-the-art labs with latest hardware',
          'International exchange programs',
          'Research opportunities in emerging technologies'
        ],
        prerequisites: [
          'Strong foundation in Mathematics',
          'Basic programming knowledge preferred',
          'Logical reasoning and problem-solving skills'
        ],
        admissionStatus: 'open',
        popularityScore: 98,
      },
      {
        name: 'Mechanical Engineering',
        code: 'MECH',
        department: 'Mechanical',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 160000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 70 },
          { criteria: 'JEE Main Score', minimumPercentage: 80 }
        ],
        seats: {
          total: 90,
          available: 35,
          reserved: { general: 45, obc: 27, sc: 13, st: 5 },
        },
        description: 'Design, analyze, and manufacture innovative mechanical systems for the automotive, aerospace, and manufacturing industries. Our program combines theoretical knowledge with hands-on experience in modern workshops and industry collaborations.',
        highlights: [
          'CAD/CAM and FEA software training',
          'Industry partnerships with Tata Motors, Maruti Suzuki',
          '85% placement rate with average package ₹8 LPA',
          'Modern workshops with CNC machines',
          'Automotive and aerospace specializations',
          'Research opportunities in renewable energy'
        ],
        prerequisites: [
          'Strong foundation in Physics and Mathematics',
          'Interest in mechanical systems and design',
          'Problem-solving and analytical skills'
        ],
        admissionStatus: 'open',
        popularityScore: 82,
      },
      {
        name: 'Electronics & Communication Engineering',
        code: 'ECE',
        department: 'Electronics & Communication',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 170000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 72 },
          { criteria: 'JEE Main Score', minimumPercentage: 82 }
        ],
        seats: {
          total: 60,
          available: 25,
          reserved: { general: 30, obc: 18, sc: 8, st: 4 },
        },
        description: 'Explore cutting-edge electronics and communication technologies including 5G, IoT, embedded systems, and VLSI design. Our program prepares students for careers in telecommunications, semiconductor industry, and research organizations.',
        highlights: [
          'VLSI design and fabrication',
          '5G and 6G communication systems',
          'IoT and embedded systems specialization',
          '90% placement rate with average package ₹10 LPA',
          'Industry partnerships with Qualcomm, Intel',
          'Research opportunities in semiconductor technology'
        ],
        prerequisites: [
          'Strong foundation in Physics and Mathematics',
          'Interest in electronics and communication systems',
          'Logical thinking and attention to detail'
        ],
        admissionStatus: 'open',
        popularityScore: 88,
      },
      {
        name: 'Civil Engineering',
        code: 'CIVIL',
        department: 'Civil',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 140000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 55 },
          { criteria: '12th grade (PCM)', minimumPercentage: 65 },
          { criteria: 'JEE Main Score', minimumPercentage: 75 }
        ],
        seats: {
          total: 60,
          available: 40,
          reserved: { general: 30, obc: 18, sc: 8, st: 4 },
        },
        description: 'Build the infrastructure of tomorrow with sustainable design principles. Our civil engineering program focuses on smart cities, green buildings, and resilient infrastructure development.',
        highlights: [
          'Smart cities and sustainable construction',
          'Government infrastructure projects',
          '80% placement rate with average package ₹6 LPA',
          'Site visits and field training',
          'Structural design and analysis software',
          'Environmental engineering specialization'
        ],
        prerequisites: [
          'Good foundation in Physics and Mathematics',
          'Interest in construction and infrastructure',
          'Spatial visualization skills'
        ],
        admissionStatus: 'open',
        popularityScore: 72,
      },
      {
        name: 'Electrical Engineering',
        code: 'EE',
        department: 'Electrical',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 150000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 68 },
          { criteria: 'JEE Main Score', minimumPercentage: 78 }
        ],
        seats: {
          total: 60,
          available: 30,
          reserved: { general: 30, obc: 18, sc: 8, st: 4 },
        },
        description: 'Study power systems, renewable energy, smart grids, and electrical machines. Our program prepares students for careers in power sector, renewable energy companies, and electrical equipment manufacturing.',
        highlights: [
          'Power systems and smart grid technology',
          'Renewable energy and sustainability focus',
          '87% placement rate with average package ₹7 LPA',
          'Advanced power systems laboratory',
          'Industry partnerships with NTPC, BHEL',
          'Electric vehicle technology specialization'
        ],
        prerequisites: [
          'Strong foundation in Physics and Mathematics',
          'Interest in electrical systems and power',
          'Analytical and problem-solving skills'
        ],
        admissionStatus: 'open',
        popularityScore: 78,
      },
      {
        name: 'Information Technology',
        code: 'IT',
        department: 'Information Technology',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 175000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 73 },
          { criteria: 'JEE Main Score', minimumPercentage: 83 }
        ],
        seats: {
          total: 60,
          available: 20,
          reserved: { general: 30, obc: 18, sc: 8, st: 4 },
        },
        description: 'Focus on information systems, cybersecurity, data science, and software development. Our IT program emphasizes practical skills and industry-relevant technologies.',
        highlights: [
          'Cybersecurity and ethical hacking',
          'Data science and big data analytics',
          '92% placement rate with average package ₹11 LPA',
          'Industry partnerships with IBM, Accenture',
          'Cloud computing and DevOps training',
          'Full-stack development specialization'
        ],
        prerequisites: [
          'Strong foundation in Mathematics',
          'Basic programming knowledge preferred',
          'Interest in information systems and security'
        ],
        admissionStatus: 'open',
        popularityScore: 91,
      },
      {
        name: 'Aerospace Engineering',
        code: 'AE',
        department: 'Applied Sciences',
        duration: { years: 4, semesters: 8 },
        fees: {
          tuition: 190000,
          hostel: 60000,
          transport: 25000,
          other: 15000,
        },
        eligibility: [
          { criteria: '10th grade', minimumPercentage: 60 },
          { criteria: '12th grade (PCM)', minimumPercentage: 75 },
          { criteria: 'JEE Main Score', minimumPercentage: 85 }
        ],
        seats: {
          total: 30,
          available: 15,
          reserved: { general: 15, obc: 9, sc: 4, st: 2 },
        },
        description: 'Design and develop aircraft, spacecraft, and related systems. Our aerospace engineering program focuses on aerodynamics, propulsion, and space technology.',
        highlights: [
          'Aerospace design and simulation',
          'Industry partnerships with ISRO, HAL',
          '88% placement rate with average package ₹9 LPA',
          'Wind tunnel testing facility',
          'Space technology specialization',
          'International exchange programs'
        ],
        prerequisites: [
          'Excellent foundation in Physics and Mathematics',
          'Interest in aviation and space technology',
          'Strong analytical and design skills'
        ],
        admissionStatus: 'open',
        popularityScore: 86,
      },
    ]);

    console.log('📚 Courses created');

    // Create News Articles with comprehensive content
    const newsArticles = await News.create([
      {
        title: 'BMIET Students Win National Hackathon 2024 - "TechForGood" Challenge',
        content:
          'Our Computer Science Engineering students from BMIET have achieved a remarkable victory at the National Innovation Challenge "TechForGood 2024", competing against 250+ teams from premier engineering colleges across India. The winning team, consisting of Rahul Sharma, Priya Patel, and Arjun Singh, developed "EduConnect AI" - an innovative AI-powered educational platform that personalizes learning experiences for students with different learning abilities.\n\n' +
          'The platform uses machine learning algorithms to analyze student performance patterns and provides customized study plans, interactive content, and real-time feedback. The judges were particularly impressed by the team\'s focus on accessibility and inclusive education, making quality education accessible to students from diverse backgrounds.\n\n' +
          'This victory highlights BMIET\'s commitment to fostering innovation and practical problem-solving skills among our students. The team will now represent India at the International Student Innovation Summit in Singapore next month.\n\n' +
          'Congratulations to our talented students and their faculty mentors Dr. Priya Sharma and Prof. Rajesh Kumar for this outstanding achievement!',
        category: 'Achievements',
        author: admin._id,
        authorName: 'Dr. Rajesh Kumar',
        publishDate: new Date('2024-03-15'),
        tags: ['hackathon', 'achievement', 'AI', 'innovation', 'students'],
        featured: true,
        status: 'published',
        views: 2847,
        likes: 156,
      },
      {
        title: 'BMIET Inaugurates State-of-the-Art AI & ML Research Laboratory',
        content:
          'BMIET has officially inaugurated its cutting-edge Artificial Intelligence and Machine Learning Research Laboratory, marking a significant milestone in our commitment to advancing technological education and research. The ₹2.5 crore facility is equipped with the latest NVIDIA RTX 4090 GPU clusters, high-performance computing systems, and advanced research tools.\n\n' +
          'The laboratory features:\n' +
          '• 20 high-end workstations with RTX 4090 GPUs\n' +
          '• NVIDIA DGX A100 system for large-scale AI model training\n' +
          '• Specialized software including TensorFlow, PyTorch, and CUDA\n' +
          '• Collaborative research spaces for faculty and students\n' +
          '• 24/7 access for research projects\n\n' +
          'This facility will support cutting-edge research in areas such as computer vision, natural language processing, robotics, and deep learning. The lab is already hosting several industry-sponsored research projects and will serve as a hub for AI innovation and collaboration.\n\n' +
          'Dr. Priya Sharma, Head of Computer Science Department, expressed excitement about the opportunities this facility will provide for both faculty and students to engage in world-class AI research.',
        category: 'Research',
        author: admin._id,
        authorName: 'Dr. Rajesh Kumar',
        publishDate: new Date('2024-03-10'),
        tags: ['AI', 'research', 'infrastructure', 'machine-learning', 'laboratory'],
        featured: true,
        status: 'published',
        views: 1456,
        likes: 98,
      },
      {
        title: 'Admissions Open for 2024-25 Academic Year - Apply Now!',
        content:
          'BMIET is pleased to announce that applications for the 2024-25 academic year are now open for all undergraduate and postgraduate engineering programs. We invite aspiring engineers to join our community of innovators and problem-solvers.\n\n' +
          'Available Programs:\n' +
          '• Computer Science Engineering (CSE)\n' +
          '• Information Technology (IT)\n' +
          '• Electronics & Communication Engineering (ECE)\n' +
          '• Mechanical Engineering (MECH)\n' +
          '• Civil Engineering (CIVIL)\n' +
          '• Electrical Engineering (EE)\n' +
          '• Aerospace Engineering (AE)\n\n' +
          'Admission Process:\n' +
          '1. Online Application Submission\n' +
          '2. Entrance Test (BMIET-ET) or JEE Main Score\n' +
          '3. Personal Interview\n' +
          '4. Document Verification\n' +
          '5. Fee Payment and Enrollment\n\n' +
          'Early Bird Benefits:\n' +
          '• 10% discount on tuition fees for applications submitted before April 30th\n' +
          '• Priority hostel accommodation\n' +
          '• Scholarship opportunities up to ₹50,000\n\n' +
          'Important Dates:\n' +
          '• Application Deadline: May 15, 2024\n' +
          '• Entrance Test: May 25, 2024\n' +
          '• Results Declaration: June 5, 2024\n' +
          '• Counseling: June 15-20, 2024\n' +
          '• Classes Begin: August 1, 2024\n\n' +
          'For more information and to apply online, visit our admissions portal or contact our admissions office.',
        category: 'Admissions',
        author: admin._id,
        authorName: 'Dr. Rajesh Kumar',
        publishDate: new Date('2024-03-08'),
        tags: ['admissions', 'announcement', '2024-25', 'engineering', 'programs'],
        featured: false,
        status: 'published',
        views: 3421,
        likes: 187,
      },
      {
        title: 'Annual Tech Fest "Innovate 2024" - Register Now for Exciting Events!',
        content:
          'BMIET proudly presents "Innovate 2024", our flagship three-day technical festival that celebrates innovation, creativity, and technological excellence. This year\'s theme is "Sustainable Technology for a Better Tomorrow".\n\n' +
          'Event Highlights:\n' +
          '• 15+ Technical Workshops on cutting-edge technologies\n' +
          '• Hackathon with ₹5 lakhs in total prize money\n' +
          '• Coding competitions and technical quizzes\n' +
          '• Robotics and IoT exhibitions\n' +
          '• Startup pitch competition\n' +
          '• Industry expert guest lectures\n\n' +
          'Workshop Topics:\n' +
          '• Cloud Computing & DevOps (AWS, Azure)\n' +
          '• Internet of Things (IoT) & Smart Cities\n' +
          '• Blockchain & Cryptocurrency\n' +
          '• Artificial Intelligence & Machine Learning\n' +
          '• Cybersecurity & Ethical Hacking\n' +
          '• Mobile App Development\n' +
          '• Data Science & Analytics\n\n' +
          'Guest Speakers:\n' +
          '• Mr. Rajesh Nair, CTO at Infosys\n' +
          '• Dr. Sarah Johnson, AI Researcher at Google\n' +
          '• Mr. Amit Patel, Founder of TechStart India\n' +
          '• Prof. David Chen, MIT Computer Science\n\n' +
          'Registration Details:\n' +
          '• Early Bird Registration: ₹500 (till March 20)\n' +
          '• Regular Registration: ₹750\n' +
          '• Group Discount: 20% off for groups of 5+\n\n' +
          'Date: April 15-17, 2024\n' +
          'Venue: BMIET Campus\n' +
          'Registration Deadline: April 10, 2024\n\n' +
          'Don\'t miss this opportunity to network with industry experts, showcase your skills, and win exciting prizes!',
        category: 'Events',
        author: admin._id,
        authorName: 'Dr. Rajesh Kumar',
        publishDate: new Date('2024-03-05'),
        tags: ['techfest', 'events', 'competitions', 'innovation', 'workshops'],
        featured: false,
        status: 'published',
        views: 2156,
        likes: 298,
      },
      {
        title: 'BMIET Signs Strategic Partnerships with Leading Tech Companies',
        content:
          'BMIET has successfully signed Memorandums of Understanding (MoUs) with three industry giants - Tata Consultancy Services (TCS), Infosys Limited, and Amazon Web Services (AWS) - marking a significant milestone in our commitment to industry-academia collaboration.\n\n' +
          'Partnership Benefits:\n\n' +
          'TCS Partnership:\n' +
          '• Joint research projects in AI and cloud computing\n' +
          '• Faculty exchange programs\n' +
          '• Industry internships for students\n' +
          '• Placement opportunities with guaranteed interviews\n\n' +
          'Infosys Partnership:\n' +
          '• Curriculum development collaboration\n' +
          '• Student mentorship programs\n' +
          '• Access to Infosys learning platforms\n' +
          '• Research funding for innovative projects\n\n' +
          'AWS Partnership:\n' +
          '• AWS Academy program implementation\n' +
          '• Cloud computing certification courses\n' +
          '• AWS credits for student projects\n' +
          '• Industry-relevant curriculum updates\n\n' +
          'These partnerships will provide our students with:\n' +
          '• Real-world industry exposure\n' +
          '• Enhanced placement opportunities\n' +
          '• Access to cutting-edge technology and tools\n' +
          '• Mentorship from industry experts\n' +
          '• Research collaboration opportunities\n\n' +
          'Dr. Rajesh Kumar, Principal of BMIET, expressed enthusiasm about these partnerships, stating, "These collaborations will bridge the gap between academic learning and industry requirements, ensuring our students are well-prepared for the evolving technological landscape."\n\n' +
          'The implementation of these partnerships will begin from the upcoming academic year 2024-25.',
        category: 'Achievements',
        author: admin._id,
        authorName: 'Dr. Rajesh Kumar',
        publishDate: new Date('2024-03-01'),
        tags: ['partnership', 'placements', 'industry', 'collaboration', 'TCS', 'Infosys', 'AWS'],
        featured: false,
        status: 'published',
        views: 1876,
        likes: 134,
      },
      {
        title: 'Guest Lecture: "The Future of Artificial Intelligence in India" by Dr. Sarah Johnson',
        content:
          'BMIET is excited to host Dr. Sarah Johnson, a renowned AI researcher and former Google DeepMind scientist, for a special guest lecture on "The Future of Artificial Intelligence in India: Opportunities and Challenges".\n\n' +
          'About the Speaker:\n' +
          'Dr. Sarah Johnson is a leading expert in artificial intelligence with over 15 years of experience in machine learning, natural language processing, and computer vision. She has published over 50 research papers in top-tier conferences and journals, and her work has been cited more than 5,000 times.\n\n' +
          'Lecture Topics:\n' +
          '• Current state of AI research and development in India\n' +
          '• Emerging trends in machine learning and deep learning\n' +
          '• AI applications in healthcare, agriculture, and education\n' +
          '• Ethical considerations in AI development\n' +
          '• Career opportunities in AI and ML\n' +
          '• Future prospects and challenges\n\n' +
          'Event Details:\n' +
          '• Date: March 25, 2024\n' +
          '• Time: 2:00 PM - 4:00 PM\n' +
          '• Venue: Main Auditorium, BMIET Campus\n' +
          '• Registration: Free for BMIET students and faculty\n' +
          '• External attendees: ₹500 registration fee\n\n' +
          'This lecture is part of BMIET\'s Distinguished Speaker Series, aimed at bringing industry experts and researchers to share their knowledge and insights with our academic community.\n\n' +
          'Seats are limited, so early registration is recommended. Register online through our student portal or contact the Computer Science Department for more information.',
        category: 'Events',
        author: admin._id,
        authorName: 'Dr. Rajesh Kumar',
        publishDate: new Date('2024-02-28'),
        tags: ['guest-lecture', 'AI', 'events', 'machine-learning', 'research'],
        featured: false,
        status: 'published',
        views: 892,
        likes: 67,
      },
    ]);

    console.log('📰 News articles created');

    // Create Placements with comprehensive data
    const placements = await Placement.create([
      {
        studentId: students[0]._id,
        companyName: 'Google',
        companyLogo: 'https://logo.clearbit.com/google.com',
        jobRole: 'Software Engineer',
        jobType: 'full-time',
        packageOffered: 4500000,
        packageType: 'CTC',
        placementDate: new Date('2024-02-15'),
        joiningDate: new Date('2024-07-01'),
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2024',
        status: 'accepted',
        interviewProcess: {
          rounds: 5,
          duration: '2 weeks',
          difficultyLevel: 'hard'
        },
        testimonial: 'The interview process was challenging but fair. Google\'s focus on problem-solving and system design really tested my skills. The team is amazing and the work culture is exactly what I was looking for.',
        isVisible: true
      },
      {
        studentId: students[1]._id,
        companyName: 'Tesla',
        companyLogo: 'https://logo.clearbit.com/tesla.com',
        jobRole: 'Mechanical Engineer',
        jobType: 'full-time',
        packageOffered: 3200000,
        packageType: 'CTC',
        placementDate: new Date('2024-01-20'),
        joiningDate: new Date('2024-06-15'),
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        sector: 'Core Engineering',
        courseId: courses[1]._id,
        batch: '2024',
        status: 'joined',
        interviewProcess: {
          rounds: 4,
          duration: '1 week',
          difficultyLevel: 'medium'
        },
        testimonial: 'Working at Tesla has been a dream come true. The innovative environment and cutting-edge technology make every day exciting. The team is supportive and encourages creative thinking.',
        isVisible: true
      },
      {
        studentId: students[2]._id,
        companyName: 'Amazon',
        companyLogo: 'https://logo.clearbit.com/amazon.com',
        jobRole: 'Data Scientist',
        jobType: 'full-time',
        packageOffered: 3800000,
        packageType: 'CTC',
        placementDate: new Date('2023-12-10'),
        joiningDate: new Date('2024-01-15'),
        location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2024',
        status: 'joined',
        interviewProcess: {
          rounds: 6,
          duration: '3 weeks',
          difficultyLevel: 'hard'
        },
        testimonial: 'Amazon\'s data science team is world-class. The projects I\'m working on have real impact on millions of customers. The learning opportunities are endless.',
        isVisible: true
      },
      {
        studentId: students[0]._id,
        companyName: 'Microsoft',
        companyLogo: 'https://logo.clearbit.com/microsoft.com',
        jobRole: 'Software Developer',
        jobType: 'full-time',
        packageOffered: 2800000,
        packageType: 'CTC',
        placementDate: new Date('2023-11-15'),
        joiningDate: new Date('2024-02-01'),
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2023',
        status: 'joined',
        interviewProcess: {
          rounds: 4,
          duration: '2 weeks',
          difficultyLevel: 'medium'
        },
        testimonial: 'Microsoft\'s culture of innovation and collaboration is amazing. The work-life balance is great and there are plenty of opportunities to grow.',
        isVisible: true
      },
      {
        studentId: students[1]._id,
        companyName: 'TCS',
        companyLogo: 'https://logo.clearbit.com/tcs.com',
        jobRole: 'Software Developer',
        jobType: 'full-time',
        packageOffered: 850000,
        packageType: 'CTC',
        placementDate: new Date('2023-10-20'),
        joiningDate: new Date('2024-01-01'),
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2023',
        status: 'joined',
        interviewProcess: {
          rounds: 3,
          duration: '1 week',
          difficultyLevel: 'easy'
        },
        testimonial: 'TCS provided excellent training and support during my initial months. The projects are diverse and help in building a strong foundation.',
        isVisible: true
      },
      {
        studentId: students[2]._id,
        companyName: 'Infosys',
        companyLogo: 'https://logo.clearbit.com/infosys.com',
        jobRole: 'System Engineer',
        jobType: 'full-time',
        packageOffered: 750000,
        packageType: 'CTC',
        placementDate: new Date('2023-09-15'),
        joiningDate: new Date('2023-12-01'),
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2023',
        status: 'joined',
        interviewProcess: {
          rounds: 3,
          duration: '1 week',
          difficultyLevel: 'easy'
        },
        testimonial: 'Infosys has a great learning environment. The mentorship program helped me transition smoothly from college to corporate life.',
        isVisible: true
      },
      {
        studentId: students[0]._id,
        companyName: 'Adobe',
        companyLogo: 'https://logo.clearbit.com/adobe.com',
        jobRole: 'Frontend Developer',
        jobType: 'full-time',
        packageOffered: 2200000,
        packageType: 'CTC',
        placementDate: new Date('2022-12-05'),
        joiningDate: new Date('2023-01-15'),
        location: { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[0]._id,
        batch: '2022',
        status: 'joined',
        interviewProcess: {
          rounds: 4,
          duration: '2 weeks',
          difficultyLevel: 'medium'
        },
        testimonial: 'Adobe\'s creative environment is perfect for frontend developers. The projects are challenging and the team is very supportive.',
        isVisible: true
      },
      {
        studentId: students[1]._id,
        companyName: 'Intel',
        companyLogo: 'https://logo.clearbit.com/intel.com',
        jobRole: 'Hardware Engineer',
        jobType: 'full-time',
        packageOffered: 1800000,
        packageType: 'CTC',
        placementDate: new Date('2022-11-20'),
        joiningDate: new Date('2023-01-01'),
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        sector: 'IT & Software',
        courseId: courses[1]._id,
        batch: '2022',
        status: 'joined',
        interviewProcess: {
          rounds: 5,
          duration: '3 weeks',
          difficultyLevel: 'hard'
        },
        testimonial: 'Working at Intel has been an incredible experience. The cutting-edge technology and research opportunities are unmatched.',
        isVisible: true
      }
    ]);

    console.log('🎯 Placements created');

    // Create Testimonials with comprehensive data
    const testimonials = await Testimonial.create([
      {
        userId: students[0]._id,
        name: 'Rahul Sharma',
        role: 'Software Engineer at Google',
        company: 'Google',
        batch: 'Class of 2024',
        content:
          'BMIET provided me with the perfect blend of theoretical knowledge and practical skills that were crucial for my success at Google. The faculty guidance, state-of-the-art infrastructure, and hands-on projects prepared me exceptionally well for my career in tech. The placement cell\'s support and the industry partnerships made all the difference.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: true,
        order: 1,
      },
      {
        userId: students[1]._id,
        name: 'Priya Patel',
        role: 'Mechanical Engineer at Tesla',
        company: 'Tesla',
        batch: 'Class of 2024',
        content:
          'The hands-on projects and industry exposure at BMIET were invaluable for my career at Tesla. The modern workshops, CAD/CAM training, and industry partnerships with leading companies gave me a competitive edge. The placement cell worked tirelessly to ensure we got opportunities at top companies, and I\'m grateful for their support.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: true,
        order: 2,
      },
      {
        name: 'Arjun Singh',
        role: 'Data Scientist at Amazon',
        company: 'Amazon',
        batch: 'Class of 2024',
        content:
          "BMIET's focus on emerging technologies like AI and ML gave me a competitive edge in the data science field. The research opportunities, mentorship from experienced faculty, and access to cutting-edge technology were exceptional. The curriculum was perfectly aligned with industry requirements.",
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: true,
        order: 3,
      },
      {
        name: 'Sneha Reddy',
        role: 'Civil Engineer at L&T',
        company: 'L&T',
        batch: 'Class of 2023',
        content:
          'The infrastructure design projects and industry visits organized by BMIET gave me real-world experience that proved invaluable in my career at L&T. The faculty\'s expertise and the practical approach to learning helped me transition smoothly into the corporate world.',
        rating: 4,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: true,
        order: 4,
      },
      {
        name: 'Vikram Mehta',
        role: 'Software Developer at Microsoft',
        company: 'Microsoft',
        batch: 'Class of 2023',
        content:
          'BMIET\'s computer science program is outstanding. The curriculum covers all the latest technologies, and the faculty is highly knowledgeable. The coding competitions and hackathons organized by the college helped me develop strong problem-solving skills that are essential in the tech industry.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: true,
        order: 5,
      },
      {
        name: 'Ananya Gupta',
        role: 'Electronics Engineer at Intel',
        company: 'Intel',
        batch: 'Class of 2023',
        content:
          'The electronics and communication program at BMIET is comprehensive and industry-relevant. The VLSI design lab and the 5G technology courses gave me a strong foundation. The faculty\'s industry experience and the research opportunities were instrumental in my success.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: true,
        order: 6,
      },
      {
        name: 'Rajesh Kumar',
        role: 'Electrical Engineer at NTPC',
        company: 'NTPC',
        batch: 'Class of 2022',
        content:
          'BMIET\'s electrical engineering program with its focus on renewable energy and smart grid technology prepared me well for my role at NTPC. The power systems lab and industry partnerships with energy companies provided excellent exposure to real-world applications.',
        rating: 4,
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: false,
        order: 7,
      },
      {
        name: 'Deepika Sharma',
        role: 'IT Consultant at IBM',
        company: 'IBM',
        batch: 'Class of 2022',
        content:
          'The information technology program at BMIET is excellent. The cybersecurity and data science courses were particularly helpful. The faculty\'s industry connections and the placement support helped me secure a great position at IBM.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: false,
        order: 8,
      },
      {
        name: 'Karan Malhotra',
        role: 'Aerospace Engineer at ISRO',
        company: 'ISRO',
        batch: 'Class of 2021',
        content:
          'BMIET\'s aerospace engineering program is one of the best in the country. The wind tunnel testing facility and the space technology courses provided excellent hands-on experience. The faculty\'s expertise and the research opportunities were outstanding.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: false,
        order: 9,
      },
      {
        name: 'Pooja Agarwal',
        role: 'Software Engineer at Adobe',
        company: 'Adobe',
        batch: 'Class of 2021',
        content:
          'The computer science program at BMIET is exceptional. The curriculum is well-designed and covers all the essential topics. The faculty is highly qualified and supportive. The placement cell\'s efforts and the industry partnerships helped me secure a great position at Adobe.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        isApproved: true,
        isFeatured: false,
        order: 10,
      }
    ]);

    console.log('💬 Testimonials created');

    // Create Events with comprehensive data
    const events = await Event.create([
      {
        title: 'Tech Fest 2024 - Innovate',
        description:
          'Annual technical festival celebrating innovation and technological excellence. Features workshops on cutting-edge technologies, hackathons with ₹5 lakhs in prizes, coding competitions, robotics exhibitions, and guest lectures from industry experts. This year\'s theme is "Sustainable Technology for a Better Tomorrow".',
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
        title: 'Workshop on Cloud Computing & DevOps',
        description:
          'Comprehensive hands-on workshop covering AWS and Azure cloud services, containerization with Docker, Kubernetes orchestration, and CI/CD pipelines. Learn to deploy scalable applications on cloud infrastructure and implement DevOps best practices.',
        eventType: 'workshop',
        startDate: new Date('2024-03-25'),
        endDate: new Date('2024-03-25'),
        venue: { location: 'BMIET Campus', room: 'Lab 301', capacity: 50 },
        organizer: faculty._id,
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
        description: 'On-campus placement drive for TCS. All eligible students from Computer Science, IT, and ECE departments can participate. Positions available for Software Developer, System Engineer, and Business Analyst roles.',
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
      {
        title: 'AI & Machine Learning Conference 2024',
        description:
          'Two-day conference featuring keynote speakers from Google, Microsoft, and leading AI research institutions. Topics include deep learning, computer vision, natural language processing, and AI ethics. Includes paper presentations and poster sessions.',
        eventType: 'conference',
        startDate: new Date('2024-05-20'),
        endDate: new Date('2024-05-21'),
        venue: { location: 'BMIET Campus', room: 'Conference Hall', capacity: 300 },
        organizer: admin._id,
        organizerName: 'AI Research Lab',
        department: 'Computer Science',
        registrationRequired: true,
        registrationDeadline: new Date('2024-05-15'),
        registrationFee: 1000,
        maxParticipants: 300,
        status: 'upcoming',
        isPublic: true,
      },
      {
        title: 'Robotics Competition - RoboTech 2024',
        description:
          'Annual robotics competition featuring autonomous robots, drone racing, and robotic arm challenges. Open to all engineering students. Prizes worth ₹2 lakhs for winners.',
        eventType: 'competition',
        startDate: new Date('2024-04-28'),
        endDate: new Date('2024-04-28'),
        venue: { location: 'BMIET Campus', room: 'Robotics Lab', capacity: 100 },
        organizer: faculty._id,
        organizerName: 'Mechanical Engineering Department',
        department: 'Mechanical',
        registrationRequired: true,
        registrationDeadline: new Date('2024-04-25'),
        registrationFee: 200,
        maxParticipants: 100,
        status: 'upcoming',
        isPublic: true,
      },
      {
        title: 'Cybersecurity Workshop',
        description:
          'Intensive workshop on cybersecurity fundamentals, ethical hacking, penetration testing, and security best practices. Hands-on labs with real-world scenarios and tools.',
        eventType: 'workshop',
        startDate: new Date('2024-03-30'),
        endDate: new Date('2024-03-30'),
        venue: { location: 'BMIET Campus', room: 'Cyber Security Lab', capacity: 40 },
        organizer: faculty._id,
        organizerName: 'IT Department',
        department: 'Information Technology',
        registrationRequired: true,
        registrationDeadline: new Date('2024-03-25'),
        registrationFee: 0,
        maxParticipants: 40,
        status: 'upcoming',
        isPublic: true,
      },
      {
        title: 'Industry Expert Seminar - Future of Technology',
        description:
          'Seminar featuring industry experts discussing emerging technologies, career opportunities, and industry trends. Panel discussion on AI, blockchain, IoT, and quantum computing.',
        eventType: 'seminar',
        startDate: new Date('2024-04-10'),
        endDate: new Date('2024-04-10'),
        venue: { location: 'BMIET Campus', room: 'Main Auditorium', capacity: 400 },
        organizer: admin._id,
        organizerName: 'Industry Relations Cell',
        department: 'All Departments',
        registrationRequired: true,
        registrationDeadline: new Date('2024-04-08'),
        registrationFee: 0,
        maxParticipants: 400,
        status: 'upcoming',
        isPublic: true,
      },
      {
        title: 'Placement Drive - Amazon',
        description: 'On-campus placement drive for Amazon. Positions available for Software Development Engineer, Data Scientist, and Cloud Support Engineer roles.',
        eventType: 'other',
        startDate: new Date('2024-04-12'),
        endDate: new Date('2024-04-12'),
        venue: { location: 'BMIET Campus', room: 'Auditorium', capacity: 150 },
        organizer: admin._id,
        organizerName: 'Placement Cell',
        registrationRequired: true,
        registrationDeadline: new Date('2024-04-08'),
        registrationFee: 0,
        maxParticipants: 150,
        status: 'upcoming',
        isPublic: false,
      }
    ]);

    console.log('📅 Events created');

    // Create sample applications
    const applications = await Application.create([
      {
        userId: students[0]._id,
        courseId: courses[0]._id,
        status: 'accepted',
        personalInfo: {
          fatherName: 'Rajesh Sharma',
          motherName: 'Sunita Sharma',
          category: 'general',
          nationality: 'Indian',
          emergencyContact: {
            name: 'Rajesh Sharma',
            relation: 'Father',
            phone: '9876543210'
          }
        },
        academicRecords: {
          tenth: {
            board: 'CBSE',
            school: 'Delhi Public School',
            percentage: 92,
            yearOfPassing: 2020
          },
          twelfth: {
            board: 'CBSE',
            school: 'Delhi Public School',
            stream: 'science',
            percentage: 88,
            yearOfPassing: 2022
          },
          entrance: {
            examName: 'JEE Main',
            rollNumber: 'JEE2022001',
            score: 285,
            rank: 15000
          }
        },
        documents: [
          {
            documentType: 'photo',
            fileName: 'photo.jpg',
            filePath: '/uploads/photo.jpg'
          },
          {
            documentType: 'tenth-marksheet',
            fileName: 'tenth_marksheet.pdf',
            filePath: '/uploads/tenth_marksheet.pdf'
          }
        ],
        personalStatement: 'I am passionate about computer science and want to contribute to the tech industry.',
        preferences: {
          hostelRequired: true,
          transportRequired: false,
          scholarshipInterest: true
        },
        submittedAt: new Date('2024-01-15'),
        reviewedAt: new Date('2024-01-20'),
        reviewedBy: admin._id,
        applicationNumber: 'BMIET2024000001',
        paymentStatus: 'paid',
        paymentAmount: 500
      },
      {
        userId: students[1]._id,
        courseId: courses[1]._id,
        status: 'pending',
        personalInfo: {
          fatherName: 'Amit Patel',
          motherName: 'Kavita Patel',
          category: 'obc',
          nationality: 'Indian',
          emergencyContact: {
            name: 'Amit Patel',
            relation: 'Father',
            phone: '9876543211'
          }
        },
        academicRecords: {
          tenth: {
            board: 'GSEB',
            school: 'Gujarat High School',
            percentage: 89,
            yearOfPassing: 2020
          },
          twelfth: {
            board: 'GSEB',
            school: 'Gujarat High School',
            stream: 'science',
            percentage: 85,
            yearOfPassing: 2022
          },
          entrance: {
            examName: 'JEE Main',
            rollNumber: 'JEE2022002',
            score: 265,
            rank: 25000
          }
        },
        documents: [
          {
            documentType: 'photo',
            fileName: 'photo.jpg',
            filePath: '/uploads/photo.jpg'
          }
        ],
        personalStatement: 'I want to pursue mechanical engineering to design innovative solutions.',
        preferences: {
          hostelRequired: true,
          transportRequired: true,
          scholarshipInterest: false
        },
        submittedAt: new Date('2024-02-10'),
        applicationNumber: 'BMIET2024000002',
        paymentStatus: 'paid',
        paymentAmount: 500
      },
      {
        userId: students[2]._id,
        courseId: courses[2]._id,
        status: 'rejected',
        personalInfo: {
          fatherName: 'Vikram Singh',
          motherName: 'Meera Singh',
          category: 'sc',
          nationality: 'Indian',
          emergencyContact: {
            name: 'Vikram Singh',
            relation: 'Father',
            phone: '9876543212'
          }
        },
        academicRecords: {
          tenth: {
            board: 'UP Board',
            school: 'UP Public School',
            percentage: 78,
            yearOfPassing: 2020
          },
          twelfth: {
            board: 'UP Board',
            school: 'UP Public School',
            stream: 'science',
            percentage: 72,
            yearOfPassing: 2022
          },
          entrance: {
            examName: 'JEE Main',
            rollNumber: 'JEE2022003',
            score: 180,
            rank: 150000
          }
        },
        documents: [
          {
            documentType: 'photo',
            fileName: 'photo.jpg',
            filePath: '/uploads/photo.jpg'
          }
        ],
        personalStatement: 'I am interested in civil engineering and infrastructure development.',
        preferences: {
          hostelRequired: false,
          transportRequired: true,
          scholarshipInterest: true
        },
        submittedAt: new Date('2024-01-25'),
        reviewedAt: new Date('2024-02-05'),
        reviewedBy: admin._id,
        reviewComments: 'Academic performance below minimum requirements',
        applicationNumber: 'BMIET2024000003',
        paymentStatus: 'paid',
        paymentAmount: 500
      },
      {
        userId: students[0]._id,
        courseId: courses[3]._id,
        status: 'submitted',
        personalInfo: {
          fatherName: 'Rajesh Sharma',
          motherName: 'Sunita Sharma',
          category: 'general',
          nationality: 'Indian',
          emergencyContact: {
            name: 'Rajesh Sharma',
            relation: 'Father',
            phone: '9876543210'
          }
        },
        academicRecords: {
          tenth: {
            board: 'CBSE',
            school: 'Delhi Public School',
            percentage: 92,
            yearOfPassing: 2020
          },
          twelfth: {
            board: 'CBSE',
            school: 'Delhi Public School',
            stream: 'science',
            percentage: 88,
            yearOfPassing: 2022
          },
          entrance: {
            examName: 'JEE Main',
            rollNumber: 'JEE2022001',
            score: 285,
            rank: 15000
          }
        },
        documents: [
          {
            documentType: 'photo',
            fileName: 'photo.jpg',
            filePath: '/uploads/photo.jpg'
          }
        ],
        personalStatement: 'Second application for electrical engineering program.',
        preferences: {
          hostelRequired: true,
          transportRequired: false,
          scholarshipInterest: true
        },
        submittedAt: new Date('2024-03-01'),
        applicationNumber: 'BMIET2024000004',
        paymentStatus: 'paid',
        paymentAmount: 500
      }
    ]);

    console.log('📝 Applications created');

    // Create sample announcements
    const announcements = await Announcement.create([
      {
        title: 'Important: Mid-Semester Examination Schedule Released',
        description: 'The mid-semester examination schedule for all courses has been released. Please check the academic calendar for your respective examination dates. Students are advised to prepare thoroughly and reach the examination hall 15 minutes before the scheduled time. For any queries, contact the examination cell.',
        category: 'Examination',
        priority: 'high',
        targetAudience: ['students'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(),
        isPinned: true,
        tags: ['examination', 'schedule', 'important'],
      },
      {
        title: 'Campus Maintenance - Internet Services',
        description: 'Scheduled maintenance of internet services will be carried out on Saturday, March 23rd, 2024 from 10:00 PM to 2:00 AM. During this time, internet connectivity may be intermittent. We apologize for any inconvenience caused.',
        category: 'Maintenance',
        priority: 'medium',
        targetAudience: ['all'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        tags: ['maintenance', 'internet'],
      },
      {
        title: 'Tech Fest 2024 - Registration Open',
        description: 'BMIET Tech Fest 2024 is here! Registration is now open for various technical competitions including coding contests, robotics challenges, and innovation showcases. Prizes worth ₹50,000 up for grabs! Register at the student portal before March 30th, 2024.',
        category: 'Event',
        priority: 'medium',
        targetAudience: ['students'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        tags: ['techfest', 'competition', 'registration'],
      },
      {
        title: 'Placement Drive - Google Interview Preparation Workshop',
        description: 'A special workshop on interview preparation for Google placements will be conducted by our alumni who are currently working at Google. The workshop will cover technical interview strategies, coding best practices, and behavioral interview tips. Limited seats available!',
        category: 'Placement',
        priority: 'high',
        targetAudience: ['students'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: ['placement', 'google', 'workshop'],
      },
      {
        title: 'Library Services Update',
        description: 'The library will now remain open till 11:00 PM on weekdays to provide extended study hours for students. New books have been added to the computer science and engineering sections. Digital resources are also available through the online portal.',
        category: 'General',
        priority: 'low',
        targetAudience: ['students', 'faculty'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        tags: ['library', 'services'],
      },
      {
        title: 'Emergency Contact Information Update',
        description: 'Please ensure your emergency contact information is up to date in the student portal. This information is crucial for safety and communication purposes. Students can update their emergency contacts through the profile section.',
        category: 'Emergency',
        priority: 'medium',
        targetAudience: ['students'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        tags: ['emergency', 'contact', 'safety'],
      },
      {
        title: 'Academic Calendar - Spring Semester 2024',
        description: 'The academic calendar for Spring Semester 2024 has been updated. Important dates include: Mid-semester exams (March 25-30), Spring break (April 1-7), Final exams (May 15-25), and Summer vacation begins (May 26). Please plan your schedule accordingly.',
        category: 'Academic',
        priority: 'medium',
        targetAudience: ['students', 'faculty'],
        author: admin._id,
        authorName: admin.profile.firstName + ' ' + admin.profile.lastName,
        publishDate: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        tags: ['academic', 'calendar', 'semester'],
      }
    ]);

    console.log('📢 Announcements created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   👥 Users: ${await User.countDocuments()} (1 admin, 1 faculty, 3 students)`);
    console.log(`   📚 Courses: ${await Course.countDocuments()} (7 engineering programs)`);
    console.log(`   📝 Applications: ${await Application.countDocuments()} (4 sample applications)`);
    console.log(`   📰 News: ${await News.countDocuments()} (6 comprehensive articles)`);
    console.log(`   📢 Announcements: ${await Announcement.countDocuments()} (7 sample announcements)`);
    console.log(`   🎯 Placements: ${await Placement.countDocuments()} (8 placement records)`);
    console.log(`   💬 Testimonials: ${await Testimonial.countDocuments()} (10 alumni testimonials)`);
    console.log(`   📅 Events: ${await Event.countDocuments()} (8 upcoming events)`);
    
    console.log('\n📝 Test Credentials:');
    console.log('🔑 Admin - Email: admin@bmiet.edu.in, Password: admin123');
    console.log('👨‍🏫 Faculty - Email: faculty@bmiet.edu.in, Password: faculty123');
    console.log('👨‍🎓 Student - Email: rahul.sharma@bmiet.edu.in, Password: student123');
    console.log('👩‍🎓 Student - Email: priya.patel@bmiet.edu.in, Password: student123');
    console.log('👨‍🎓 Student - Email: arjun.singh@bmiet.edu.in, Password: student123');
    
    console.log('\n🎯 Key Features:');
    console.log('   • Realistic fake data with proper relationships');
    console.log('   • Comprehensive course information with fees and eligibility');
    console.log('   • Detailed news articles with proper categorization');
    console.log('   • Placement records with company logos and testimonials');
    console.log('   • Alumni testimonials with avatars and ratings');
    console.log('   • Upcoming events with registration details');
    console.log('   • Duplicate prevention - safe to run multiple times');
    
    console.log('\n🚀 Ready for testing and demo!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

