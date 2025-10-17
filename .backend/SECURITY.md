# 🔒 Security Implementation Guide

This document outlines the comprehensive security features implemented in the BMIET Portal backend.

## 🛡️ Security Features

### 1. **HTTP Headers Security (Helmet)**
- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing

### 2. **Rate Limiting**
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **Registration**: 5 registration attempts per hour per IP
- **Password Reset**: 3 attempts per hour per IP

### 3. **Input Sanitization**
- **MongoDB Injection Protection**: Sanitizes `$` and `.` characters
- **XSS Protection**: Removes malicious scripts from input
- **Custom Sanitization**: Strips HTML tags and dangerous characters

### 4. **Password Security**
- **bcrypt Hashing**: Configurable salt rounds (default: 12)
- **Password Strength**: Enforced in validation
  - Minimum 8 characters
  - Uppercase, lowercase, number, special character required

### 5. **JWT Authentication**
- **Access Tokens**: Short-lived (15 minutes default)
- **Refresh Tokens**: Long-lived (7 days default)
- **HttpOnly Cookies**: Refresh tokens stored securely
- **Token Rotation**: New refresh token on each refresh

### 6. **CORS Configuration**
- **Origin Restriction**: Only allows configured frontend URLs
- **Credentials**: Supports authenticated requests

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Copy the example file
cp env.example .env

# Edit with your values
nano .env
```

### Required Environment Variables

```env
# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Database
MONGODB_URI=mongodb://localhost:27017/bmiet-portal

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Usage Examples

### 1. **Authentication Flow**

```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response includes access token
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "expiresIn": "15m"
  }
}

// Refresh token (automatic via cookie)
POST /api/auth/refresh
// Returns new access token
```

### 2. **Protected Routes**

```javascript
// Include Bearer token in Authorization header
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Role-based access
GET /api/admin/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// Only accessible by admin/faculty users
```

### 3. **Rate Limiting Response**

```javascript
// When rate limit exceeded
HTTP 429 Too Many Requests
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

## 🔍 Security Testing

### 1. **Test Rate Limiting**
```bash
# Rapid requests to test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' &
done
```

### 2. **Test XSS Protection**
```bash
# Attempt XSS injection
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!","profile":{"firstName":"<script>alert(\"XSS\")</script>"}}'
```

### 3. **Test MongoDB Injection**
```bash
# Attempt NoSQL injection
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$ne":null},"password":{"$ne":null}}'
```

## 🚨 Security Headers

The server sets the following security headers:

```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

## 🔐 Best Practices

### 1. **Token Management**
- Store access tokens in memory (not localStorage)
- Use HttpOnly cookies for refresh tokens
- Implement token rotation
- Set appropriate expiration times

### 2. **Password Security**
- Use strong password policies
- Implement account lockout after failed attempts
- Consider password history to prevent reuse

### 3. **Input Validation**
- Validate all inputs on both client and server
- Sanitize user data before processing
- Use parameterized queries

### 4. **Error Handling**
- Don't expose sensitive information in error messages
- Log security events for monitoring
- Implement proper error codes

## 📊 Monitoring

### Security Events to Monitor
- Failed login attempts
- Rate limit violations
- Token validation failures
- Input sanitization triggers
- Unusual API usage patterns

### Logging
```javascript
// Example security event logging
console.log('Security Event:', {
  type: 'FAILED_LOGIN',
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString()
});
```

## 🛠️ Maintenance

### Regular Security Tasks
1. **Update Dependencies**: Keep security packages updated
2. **Rotate Secrets**: Change JWT secrets periodically
3. **Review Logs**: Monitor for suspicious activity
4. **Test Security**: Regular penetration testing
5. **Update Policies**: Review and update security policies

### Security Checklist
- [ ] Strong JWT secrets configured
- [ ] Rate limiting properly configured
- [ ] CORS origins restricted
- [ ] HTTPS enforced in production
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak information
- [ ] Security headers properly set
- [ ] Password policies enforced
- [ ] Token expiration times appropriate
- [ ] Monitoring and logging in place

## 🆘 Incident Response

### If Security Breach Suspected
1. **Immediate Actions**:
   - Rotate all JWT secrets
   - Review access logs
   - Check for unusual patterns
   - Notify users if necessary

2. **Investigation**:
   - Analyze logs for attack vectors
   - Identify compromised accounts
   - Assess data exposure
   - Document findings

3. **Recovery**:
   - Patch vulnerabilities
   - Update security measures
   - Reset affected accounts
   - Implement additional monitoring

## 📞 Support

For security-related issues or questions:
- Review this documentation
- Check the logs for error details
- Contact the development team
- Report security vulnerabilities responsibly
