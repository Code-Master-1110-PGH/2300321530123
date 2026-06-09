# Quick Start Guide

## 📋 Prerequisites

- Node.js 16+ and npm
- Git
- Test Server Credentials (from registration)

## 🚀 Getting Started in 5 Minutes

### 1. Register on Test Server

Go to `http://4.224.186.213/evaluation-service` and register with:
- Email
- Roll Number: `2300321530123`
- GitHub Username
- Access Code (received via email)

Save the `clientID` and `clientSecret` received.

### 2. Setup Environment

```bash
# Create .env file
cp .env.example .env

# Fill in your credentials in .env
# EVALUATION_SERVICE_URL=http://4.224.186.213/evaluation-service
# CLIENT_ID=your_client_id
# CLIENT_SECRET=your_client_secret
```

### 3. Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Install & Run Frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## 🔍 Test the Application

### Test Authentication Flow

1. Open frontend: `http://localhost:3000`
2. Enter your `clientID` and `clientSecret`
3. Click "Authenticate"
4. You'll receive an access token

### Test Logging

Use Postman or curl to test the logging endpoint:

```bash
curl -X POST http://localhost:5000/api/logs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stack": "backend",
    "level": "info",
    "package": "handler",
    "message": "test message"
  }'
```

## 📁 Project Structure Overview

```
backend/          → Express server with TypeScript
frontend/         → React app with TypeScript
common/           → Shared utilities and middleware
  ├── auth/       → Authentication service
  ├── config/     → Constants and config
  ├── middleware/ → Logging middleware
  └── utils/      → HTTP client and helpers
```

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/authenticate` | Get access token | No |
| POST | `/api/logs` | Create log entry | Yes |
| GET | `/health` | Health check | No |

## 📝 Important Notes

- All fields sent to logging API must be **lowercase**
- Access token required for protected routes (in `Authorization: Bearer` header)
- Logs are validated against allowed values per stack
- Check browser console for frontend logs
- Check terminal console for backend logs

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
BACKEND_PORT=5001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Backend CORS is enabled for all origins (development only)
- Change CORS policy in `backend/src/index.ts` for production

## 📚 Next Steps

1. ✅ Implement additional business logic in controllers
2. ✅ Add database integration (PostgreSQL recommended)
3. ✅ Implement caching layer
4. ✅ Add scheduled tasks (cron jobs)
5. ✅ Enhance frontend with more components
6. ✅ Add unit tests
7. ✅ Setup deployment pipeline

## 📞 Support

For issues, check:
- `.env` file configuration
- Terminal logs for error messages
- Browser DevTools console for frontend errors
- README.md for detailed documentation

---

**Happy Coding!** 🚀
