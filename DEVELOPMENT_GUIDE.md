# BMIET Portal - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB 4.4+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bmite-portal-pulse
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd .backend
   npm install
   
   # Frontend
   cd ../.frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp .backend/.env.example .backend/.env
   cp .frontend/.env.example .frontend/.env
   
   # Update with your values
   nano .backend/.env
   nano .frontend/.env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd .backend
   npm start
   
   # Terminal 2 - Frontend
   cd .frontend
   npm run dev
   ```

## 🏗️ Architecture

### Frontend Structure
```
.frontend/src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── admin/          # Admin-specific components
│   └── home/           # Homepage components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── config/             # Configuration files
└── i18n/               # Internationalization
```

### Backend Structure
```
.backend/
├── controllers/        # Route handlers
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── utils/             # Utility functions
└── seeders/           # Database seeders
```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states and skeleton loaders
- Ensure accessibility compliance

### API Guidelines
- Use RESTful conventions
- Implement proper error handling
- Add request validation
- Include proper HTTP status codes

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd .frontend
npm run test

# Backend tests
cd .backend
npm run test
```

### Test Coverage
- Aim for 80%+ code coverage
- Test critical user flows
- Include unit and integration tests

## 🚀 Performance

### Frontend Optimizations
- Lazy loading for heavy components
- Image optimization
- Code splitting
- Memoization for expensive calculations

### Backend Optimizations
- Database indexing
- Query optimization
- Caching strategies
- Rate limiting

## 🔒 Security

### Authentication
- JWT tokens with refresh mechanism
- Secure password hashing (bcrypt)
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Testing
- Test on multiple devices
- Use browser dev tools
- Validate with real devices

## 🌐 Internationalization

### Adding New Languages
1. Create language file in `frontend/src/i18n/locales/`
2. Add language to `i18n/config.ts`
3. Update language switcher component

### Usage
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
};
```

## 🐛 Debugging

### Frontend Debugging
- Use React DevTools
- Check browser console
- Use Redux DevTools (if applicable)

### Backend Debugging
- Use console.log for development
- Check server logs
- Use debugging tools (VS Code debugger)

## 📦 Deployment

### Production Build
```bash
# Frontend
cd .frontend
npm run build

# Backend
cd .backend
npm run build
```

### Environment Variables
- Set production environment variables
- Configure database connections
- Set up SSL certificates
- Configure CDN for static assets

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name`
- `bugfix/bug-description`
- `hotfix/critical-fix`

### Commit Messages
- Use conventional commits
- Be descriptive and concise
- Reference issue numbers

### Pull Requests
- Include description of changes
- Add screenshots if UI changes
- Request code review
- Ensure tests pass

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Manual](https://docs.mongodb.com)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the documentation first

---

**Happy Coding! 🎉**
