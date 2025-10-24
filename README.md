# BMIET Modern Student Portal

A comprehensive, modern web portal for BMIET (Bundelkhand Institute of Engineering and Technology) featuring advanced user management, real-time announcements, interactive course catalog, and a complete admin dashboard with analytics.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **React Router v6** - Client-side routing
- **Recharts** - Data visualization
- **React Query** - Server state management
- **Context API** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** - Stateless authentication
- **Joi** - Request validation
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 📁 Project Structure

```
bmite-portal-pulse/
├── .frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── admin/           # Admin-specific components
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── pages/               # Route components
│   │   ├── contexts/            # React contexts
│   │   ├── types/               # TypeScript definitions
│   │   ├── utils/               # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── data/                # Static data
│   └── public/                  # Static assets
│
├── .backend/                    # Express backend API
│   ├── controllers/             # Business logic controllers
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route definitions
│   ├── middleware/              # Custom middleware
│   └── seeders/                 # Database seeding
│
├── DEVELOPMENT_GUIDE.md         # Development documentation
└── README.md                   # This file
```

## 🎯 Features

### 🎨 Frontend Features
- 🏠 **Modern Homepage** - Hero section with dynamic content
- 📚 **Course Catalog** - Interactive course browsing with search & filters
- 📊 **Analytics Dashboard** - Real-time statistics and charts
- 📢 **Announcements System** - Real-time notifications and updates
- 👤 **Student Profiles** - Comprehensive user management
- 🎓 **Admin Dashboard** - Complete administrative control panel
- 📰 **News & Events** - Dynamic content management
- 🔍 **Advanced Search** - Smart filtering across all content
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI/UX** - Clean, intuitive interface

### 🔧 Backend Features
- 🔐 **JWT Authentication** - Secure token-based auth
- 👥 **Role-Based Access** - Student/Faculty/Admin permissions
- 📝 **Course Management** - Full CRUD operations
- 📋 **Application Tracking** - Student application workflow
- 📢 **Announcement System** - Real-time notifications
- 👤 **User Management** - Profile and account management
- 📊 **Analytics API** - Data insights and reporting
- 📰 **Content Management** - News, events, and updates
- 🛡️ **Security Features** - Rate limiting, validation, sanitization
- 🔄 **Real-time Updates** - Live data synchronization

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

### Frontend Setup

```bash
# Navigate to frontend directory
cd .frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will run on `http://localhost:8080`

### Backend Setup

```bash
# Navigate to backend directory
cd .backend

# Install dependencies
npm install

# Create .env file with the following variables:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/bmiet-portal
# JWT_SECRET=your-secret-key
# NODE_ENV=development

# Seed the database (optional)
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

The backend API will run on `http://localhost:5000`

## 📖 API Documentation

The backend provides comprehensive REST API endpoints:

### 🔐 Authentication & Users
- **`/api/auth`** - Login, register, profile management
- **`/api/student`** - Student-specific operations
- **`/api/admin`** - Administrative functions

### 📚 Content Management
- **`/api/courses`** - Course catalog and management
- **`/api/news`** - News articles and updates
- **`/api/announcements`** - Real-time announcements

### 📊 Analytics & Reports
- **`/api/analytics`** - Dashboard statistics
- **`/api/reports`** - Data insights and exports

### 🛡️ Security Features
- Rate limiting on all endpoints
- JWT token validation
- Role-based access control
- Input sanitization and validation

> **Note:** All API endpoints require proper authentication headers. See the development guide for detailed usage examples.

## 🔑 Default Credentials (After Seeding)

### 👨‍💼 Admin Account
- **Email:** `admin@bmiet.ac.in`
- **Password:** `admin123`
- **Access:** Full administrative privileges

### 👨‍🎓 Student Account
- **Email:** `student@bmiet.ac.in`
- **Password:** `student123`
- **Access:** Student portal features

### 👨‍🏫 Faculty Account
- **Email:** `faculty@bmiet.ac.in`
- **Password:** `faculty123`
- **Access:** Faculty management features

> **Security Note:** Change default passwords in production environment.

## 🧪 Testing

### 🧪 Backend API Testing
Use Postman, Thunder Client, or cURL to test API endpoints.

#### Quick Test Examples:
```bash
# Health check
curl http://localhost:5000/api/health

# Admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bmiet.ac.in","password":"admin123"}'

# Get announcements (requires auth token)
curl -X GET http://localhost:5000/api/announcements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 🎨 Frontend Testing
- **Development:** `npm run dev` - Hot reload development
- **Build Test:** `npm run build` - Production build verification
- **Linting:** `npm run lint` - Code quality checks

## 🚀 Deployment

### 🌐 Frontend Deployment
Build and deploy to static hosting services:

```bash
cd .frontend
npm run build
# Deploy the 'dist' folder to:
# - Netlify (drag & drop)
# - Vercel (git integration)
# - GitHub Pages
# - AWS S3 + CloudFront
```

### 🔧 Backend Deployment
Deploy to cloud platforms:

```bash
cd .backend
# Set environment variables:
# - MONGODB_URI
# - JWT_SECRET
# - NODE_ENV=production
# - PORT (auto-assigned)

# Deploy to:
# - Heroku (git push heroku main)
# - Railway (git push railway main)
# - AWS EC2/Elastic Beanstalk
# - DigitalOcean App Platform
```

### 🔒 Production Checklist
- [ ] Update environment variables
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Backup database regularly

## 📝 Development

### 🎨 Frontend Development
- **Components:** `src/components/` - Reusable UI components
- **Pages:** `src/pages/` - Route-based page components
- **Contexts:** `src/contexts/` - React context providers
- **Types:** `src/types/` - TypeScript definitions
- **Utils:** `src/utils/` - Helper functions
- **Styling:** Tailwind CSS with shadcn/ui components
- **Routing:** React Router v6 with protected routes

### 🔧 Backend Development
- **Architecture:** MVC pattern with modular structure
- **Controllers:** Business logic in `controllers/`
- **Models:** Mongoose schemas in `models/`
- **Routes:** API endpoints in `routes/`
- **Middleware:** Authentication, validation, error handling
- **Security:** Rate limiting, CORS, input sanitization

### 🛠️ Development Tools
- **Hot Reload:** Vite dev server with instant updates
- **TypeScript:** Full type safety and IntelliSense
- **ESLint:** Code quality and consistency
- **Prettier:** Code formatting
- **Git Hooks:** Pre-commit validation

## 🔒 Security Features

### 🛡️ Authentication & Authorization
- **JWT Tokens** - Stateless authentication
- **Role-Based Access** - Student/Faculty/Admin permissions
- **Password Security** - bcrypt hashing with salt rounds
- **Session Management** - Secure token handling

### 🚫 API Protection
- **Rate Limiting** - Prevents API abuse and DDoS
- **Input Validation** - Joi schema validation
- **SQL Injection Prevention** - Mongoose ODM protection
- **XSS Protection** - Input sanitization
- **CORS Configuration** - Cross-origin request control

### 🔐 Infrastructure Security
- **Helmet Headers** - Security HTTP headers
- **Environment Variables** - Sensitive data protection
- **HTTPS Enforcement** - SSL/TLS encryption
- **Error Handling** - Secure error responses

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 📋 Contribution Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### 📝 Code Standards
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes

### 🐛 Bug Reports
- Use the issue template
- Provide reproduction steps
- Include environment details
- Add screenshots if applicable

## 📄 License

This project is licensed under the MIT License.

## 🤖 AI Development Tools

This project leverages cutting-edge AI development tools:

- **🧠 Cursor AI** - Intelligent code completion and refactoring
- **⚡ Claude AI** - Advanced API design and database optimization
- **🎨 Lovebel AI** - React component generation and UI optimization
- **🔧 Custom Prompts** - Project-specific AI fine-tuning

## 👥 Team & Credits

### 🏆 BMIET Vibe Coding Challenge - Stage 2
- **Developer:** Abhaypratap0709
- **Track:** Web Development
- **Challenge:** Modern Student Portal Development

### 🛠️ Technology Partners
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + MongoDB
- **UI/UX:** Tailwind CSS + shadcn/ui
- **Deployment:** Cloud-native architecture

## 📞 Support & Community

### 🆘 Getting Help
- **Issues:** Open a GitHub issue for bugs or feature requests
- **Discussions:** Use GitHub Discussions for questions
- **Documentation:** Check `DEVELOPMENT_GUIDE.md` for detailed setup

### 🌟 Show Your Support
- ⭐ Star the repository
- 🍴 Fork and contribute
- 📢 Share with the community

---

**🚀 Built with ❤️ for BMIET - Empowering Education Through Technology**
