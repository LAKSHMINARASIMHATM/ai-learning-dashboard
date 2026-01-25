# Server Environment Variables Example

Copy this file to `server/.env` and fill in your actual values.

## Database Configuration
```
MONGODB_URI=mongodb://localhost:27017/ai-learning-dashboard
```

## JWT Configuration (Required - Server will fail without these)
```
JWT_SECRET=your-super-secure-random-string-at-least-32-characters-long
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

## Server Configuration
```
PORT=5000
NODE_ENV=development
```

## CORS Configuration
```
CORS_ORIGIN=http://localhost:3000
```

## AI Configuration (Optional)
```
OPENAI_API_KEY=your-openai-api-key-here
```

## Security Notes
- `JWT_SECRET` must be at least 32 characters for security
- Never commit `.env` files to version control
- Use different secrets for production
