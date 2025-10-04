# 🚀 QUICK START GUIDE

Get the backend running in 3 minutes!

## Step 1: Install Dependencies

```bash
cd .backend
npm install
```

## Step 2: Start MongoDB

**Windows:**
```bash
# Open MongoDB Compass or run:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

## Step 3: Seed Database

```bash
npm run seed
```

You should see:
```
✅ Database seeded successfully!

📝 Sample Credentials:
Admin - Email: admin@bmiet.edu.in, Password: admin123
Student - Email: rahul.sharma@bmiet.edu.in, Password: student123
```

## Step 4: Start Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000 in development mode
📡 API available at http://localhost:5000/api
```

## Step 5: Test API

Open your browser or Postman:

**Health Check:**
```
GET http://localhost:5000/api/health
```

**Get Courses:**
```
GET http://localhost:5000/api/courses
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@bmiet.edu.in",
  "password": "admin123"
}
```

## 🎉 Done!

Your backend is now running with:
- ✅ 5 sample courses
- ✅ 2 student accounts + 1 admin
- ✅ 6 news articles
- ✅ 5 placement records
- ✅ 4 testimonials
- ✅ 3 upcoming events

## 🔗 Connect Frontend

Make sure frontend `.env` has:
```
VITE_API_URL=http://localhost:5000/api
```

## 📚 Next Steps

1. Check `README.md` for full API documentation
2. Test endpoints in Postman
3. Connect to frontend
4. Start building features!

## ⚠️ Troubleshooting

**MongoDB not connecting?**
- Install MongoDB: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

**Port 5000 in use?**
- Change `PORT=5000` to `PORT=5001` in `.env` file

**Need to reset data?**
```bash
npm run seed
```

