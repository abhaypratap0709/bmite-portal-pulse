# BMIET Modern Student Portal

A modern, responsive web portal for BMIET (Bundelkhand Institute of Engineering and Technology) featuring a streamlined user experience, interactive elements, and comprehensive admission information.

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Recharts** - Data visualization
- **React Query** - Data fetching

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Joi** - Validation
- **bcryptjs** - Password hashing
- **Helmet** - Security headers

## 📁 Project Structure

```
bmite-portal-pulse/
├── .frontend/          # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom hooks
│   │   └── lib/        # Utilities
│   └── public/         # Static assets
│
├── .backend/           # Express backend API
│   ├── controllers/    # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── seeders/        # Database seeding
│
├── PRD.md             # Product Requirements Document
└── README.md          # This file
```

## 🎯 Features

### Frontend
- 🏠 Modern homepage with hero section
- 📚 Course catalog with detailed information
- 📊 Interactive placement statistics
- 📰 Latest news and announcements
- 💬 Student testimonials
- 🎓 Comprehensive admissions hub
- 📱 Fully responsive design
- 🎨 Clean, modern UI

### Backend API
- 🔐 JWT authentication & authorization
- 👥 Role-based access control (Student/Faculty/Admin)
- 📝 Course management
- 📋 Application tracking system
- 📰 News & events management
- 📊 Placement statistics
- 💬 Testimonials system
- 🛡️ Security features (rate limiting, sanitization)

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

The backend provides the following API endpoints:

- **Authentication:** `/api/auth` - Register, login, profile management
- **Courses:** `/api/courses` - Course catalog and details
- **Applications:** `/api/applications` - Submit and track applications
- **News:** `/api/news` - News articles
- **Placements:** `/api/placements` - Placement statistics
- **Testimonials:** `/api/testimonials` - Student testimonials
- **Events:** `/api/events` - Campus events
- **Admin:** `/api/admin` - Admin operations

See `.backend/API_TESTING.md` for detailed endpoint documentation.

## 🔑 Default Credentials (After Seeding)

**Admin:**
- Email: `admin@bmiet.ac.in`
- Password: `admin123`

**Student:**
- Email: `student@bmiet.ac.in`
- Password: `student123`

## 🧪 Testing

### Backend Testing
Use Postman, Thunder Client, or cURL to test API endpoints.

Example:
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bmiet.ac.in","password":"admin123"}'
```

## 🚀 Deployment

### Frontend
Build the frontend and deploy to any static hosting service:
```bash
cd .frontend
npm run build
# Deploy the 'dist' folder to Netlify, Vercel, etc.
```

### Backend
Deploy to Heroku, Railway, or any Node.js hosting:
```bash
cd .backend
# Set environment variables
# Deploy using your hosting provider's instructions
```

## 📝 Development

### Frontend Development
- Components are in `src/components/`
- Pages use React Router in `src/pages/`
- Styling uses Tailwind CSS utility classes
- UI components from shadcn/ui in `src/components/ui/`

### Backend Development
- Follow MVC architecture
- Controllers handle business logic
- Models define database schemas
- Middleware for auth, validation, error handling
- All routes are modular and organized

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- MongoDB query sanitization
- Helmet security headers
- CORS configuration
- Input validation with Joi

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**BMIET Vibe Coding Challenge - Stage 2**
- Team: Abhaypratap0709
- Track: Web Development

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for BMIET**
