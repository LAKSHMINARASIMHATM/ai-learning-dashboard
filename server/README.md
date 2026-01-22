# AI Learning Dashboard - Backend API

A comprehensive RESTful API built with Express.js, TypeScript, and MongoDB for the AI Learning Dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On Linux/Mac
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### 🔐 Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

#### 👤 User Management
- `PUT /user/profile` - Update user profile (protected)
- `PUT /user/settings` - Update user settings (protected)

#### 📊 Progress & Analytics
- `GET /progress` - Get user progress (protected)
- `POST /progress/quiz` - Submit quiz score (protected)
- `POST /progress/study-time` - Log study time (protected)
- `GET /analytics/quiz-scores` - Get quiz scores trend (protected)
- `GET /analytics/study-time` - Get study time data (protected)
- `GET /analytics/improvement` - Get improvement metrics (protected)
- `GET /analytics/summary` - Get full analytics summary (protected)

#### 🛤️ Learning Path
- `GET /learning-path` - Get user's learning path (protected)
- `PUT /learning-path/step/:stepId` - Update step progress (protected)
- `POST /learning-path/generate` - Generate new learning path (protected)

#### 📚 Resources
- `GET /resources` - Get all resources (public)
- `GET /resources/:id` - Get single resource (public)
- `GET /resources/user/recommended` - Get AI-recommended resources (protected)
- `POST /resources` - Create new resource (protected)

#### 💬 AI Assistant
- `POST /assistant/chat` - Send message to AI (protected)
- `GET /assistant/history` - Get chat history (protected)
- `DELETE /assistant/history` - Clear chat history (protected)
- `GET /assistant/suggestions` - Get suggested topics (protected)

#### 🎯 Skill Gaps
- `GET /skill-gaps` - Get user's skill gaps (protected)
- `POST /skill-gaps/assessment` - Submit skill assessment (protected)
- `GET /skill-gaps/recommendations` - Get recommendations (protected)

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   └── server.ts        # Entry point
├── package.json
└── tsconfig.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## 🗄️ Database Models

- **User** - User authentication and preferences
- **Progress** - Learning progress tracking
- **LearningPath** - Personalized learning paths
- **Resource** - Learning materials
- **ChatMessage** - AI assistant conversation history
- **SkillGap** - Skill assessments and gaps

## 🔑 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-learning-dashboard
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 📝 Example Usage

### Register a new user
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Progress
```javascript
GET /api/progress
Headers: {
  "Authorization": "Bearer <token>"
}
```

## 🎨 Frontend Integration

Use the API client in `lib/api.ts`:

```typescript
import api from '@/lib/api';

// Login
const result = await api.login('user@example.com', 'password');

// Get progress
const progress = await api.getProgress();

// Get recommendations
const resources = await api.getRecommendedResources();
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Request validation
- Error handling middleware

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **joi** - Validation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC
