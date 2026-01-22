# AI Learning Dashboard - Quick Start Guide

## 🎯 What's Been Created

A complete backend API with:
- ✅ **8 API Routes** - Auth, User, Progress, Analytics, Learning Path, Resources, AI Assistant, Skill Gaps
- ✅ **6 Database Models** - User, Progress, LearningPath, Resource, ChatMessage, SkillGap
- ✅ **25+ Endpoints** - Full RESTful API
- ✅ **JWT Authentication** - Secure user sessions
- ✅ **AI Assistant** - Intelligent chat responses
- ✅ **Frontend API Client** - Ready to use in your React components

---

## 🚀 Getting Started

### Step 1: Install MongoDB
If you don't have MongoDB installed:
- **Windows**: Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: Follow [official guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

Start MongoDB:
```bash
# Windows (run as service, or)
mongod

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 2: Install Dependencies
```bash
# Install concurrently for running both servers
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 3: Start Both Servers
```bash
# Run frontend + backend together
npm run dev:all
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

**Frontend**: http://localhost:3000  
**Backend API**: http://localhost:5000

---

## 📡 API Endpoints Overview

### Authentication
```javascript
POST /api/auth/register  // Register new user
POST /api/auth/login     // Login
GET  /api/auth/me        // Get current user
```

### Progress & Analytics
```javascript
GET  /api/progress                // User progress
GET  /api/analytics/summary       // Full analytics
POST /api/progress/quiz           // Submit quiz score
```

### Learning Path
```javascript
GET  /api/learning-path           // Get learning path
PUT  /api/learning-path/step/:id  // Update step
```

### Resources
```javascript
GET  /api/resources                    // All resources
GET  /api/resources/user/recommended   // AI recommendations
```

### AI Assistant
```javascript
POST /api/assistant/chat       // Send message
GET  /api/assistant/history    // Chat history
```

---

## 💻 Using the API in Your Frontend

The API client is ready at `lib/api.ts`:

```typescript
import api from '@/lib/api';

// Example: Login
const handleLogin = async () => {
  const result = await api.login('user@example.com', 'password');
  if (result.success) {
    console.log('Logged in!', result.data);
  }
};

// Example: Get progress
const loadProgress = async () => {
  const result = await api.getProgress();
  if (result.success) {
    setProgress(result.data);
  }
};

// Example: Chat with AI
const sendMessage = async (message: string) => {
  const result = await api.sendMessage(message);
  if (result.success) {
    setMessages([...messages, result.data]);
  }
};
```

---

## 🔧 Environment Variables

Backend `.env` file is already created at `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-learning-dashboard
JWT_SECRET=ai-learning-dashboard-super-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

---

## 📝 Next Steps

1. **Test the API**: Use the health check endpoint
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Register a user**: 
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

3. **Update your frontend pages** to use the API client instead of hardcoded data

4. **Customize the AI responses** in `server/src/controllers/assistant.controller.ts`

---

## 📚 Documentation

- **Backend README**: `server/README.md`
- **API Client**: `lib/api.ts`
- **Walkthrough**: Check the artifacts panel

---

## 🎉 You're All Set!

Your AI Learning Dashboard now has a complete backend with:
- User authentication
- Progress tracking
- AI-powered recommendations
- Chat assistant
- Skill gap analysis

Start building amazing features! 🚀
