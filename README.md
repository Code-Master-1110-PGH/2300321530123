# Affordmed Full Stack Challenge - 2300321530123

A production-grade Full Stack application implementing the Affordmed coding challenge requirements.

## Overview

This project demonstrates a complete full-stack implementation with:
- **Backend**: Node.js/Express server with authentication and logging
- **Frontend**: React/TypeScript application with Material UI styling
- **Common**: Shared authentication service, logging middleware, and utilities
- **Logging**: Centralized logging middleware with integration to test server

## Project Structure

```
2300321530123/
├── backend/
│   ├── src/
│   │   ├── cache/              # Caching layer
│   │   ├── controller/         # Business logic controllers
│   │   ├── cron_job/          # Scheduled tasks
│   │   ├── db/                # Database configuration
│   │   ├── domain/            # Domain models
│   │   ├── handler/           # Request handlers
│   │   │   └── authHandler.ts # Authentication handler
│   │   ├── middleware/        # Express middleware
│   │   │   └── auth.ts        # Auth middleware
│   │   ├── repository/        # Data access layer
│   │   ├── route/             # API routes
│   │   │   ├── authRoute.ts
│   │   │   └── logRoute.ts
│   │   ├── service/           # Business services
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API client utilities
│   │   ├── component/         # Reusable React components
│   │   ├── hook/              # Custom React hooks
│   │   ├── page/              # Page components
│   │   ├── state/             # State management (Redux, Context API)
│   │   ├── style/             # Stylesheets
│   │   ├── App.tsx            # Main app component
│   │   ├── App.css            # App styles
│   │   ├── index.tsx          # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   └── public/
│
├── common/
│   ├── auth/
│   │   └── authService.ts     # Auth service (register, authenticate)
│   ├── config/
│   │   └── constants.ts       # Configuration constants
│   ├── middleware/
│   │   └── logger.ts          # Logging middleware
│   └── utils/
│       └── httpClient.ts      # HTTP client with interceptors
│
├── .gitignore
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Git
- Environment variables configured

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Update with your values:
```env
EVALUATION_SERVICE_URL=http://4.224.186.213/evaluation-service
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ACCESS_TOKEN=your_access_token
BACKEND_PORT=5000
NODE_ENV=development
```

### 3. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

**Frontend (in another terminal):**
```bash
cd frontend
npm start
```

The frontend app will open on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "your-email@example.com",
  "rollNumber": "2300321530123",
  "gitHubUsername": "your-username",
  "accessCode": "received-via-email",
  "track": "fullstack"
}

Response:
{
  "clientID": "xxxx-xxxx",
  "clientSecret": "yyyy-yyyy"
}
```

#### Authenticate
```
POST /api/auth/authenticate
Content-Type: application/json

{
  "clientID": "xxxx-xxxx",
  "clientSecret": "yyyy-yyyy"
}

Response:
{
  "access_token": "jwt-token-here",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Logging

#### Create Log
```
POST /api/logs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "stack": "backend",
  "level": "error",
  "package": "handler",
  "message": "received string, expected bool"
}

Response:
{
  "logID": "a4aad02e-19d0-4153-86d9-58bf55d7c402",
  "message": "log created successfully"
}
```

## Logging Middleware

The logging middleware supports:

**Allowed Values:**
- **Stack**: `backend`, `frontend`
- **Level**: `debug`, `info`, `warn`, `error`
- **Package**: Based on stack
  - Backend: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`
  - Frontend: `api`, `component`, `hook`, `page`, `state`, `style`
  - Common: `auth`, `config`, `middleware`, `utils`

**Usage Example:**

```typescript
import Logger from '../common/middleware/logger';

const logger = new Logger();

// Set access token after authentication
logger.setAccessToken(accessToken);

// Log messages
await logger.info('handler', 'User logged in successfully', 'backend');
await logger.error('controller', 'Database connection failed', 'backend');
await logger.warn('component', 'Component will unmount', 'frontend');
await logger.debug('api', 'Fetching user data', 'frontend');
```

## Authentication Flow

1. **Registration**: Register on test server with email, roll number, GitHub username, and access code
2. **Get Credentials**: Receive `clientID` and `clientSecret`
3. **Authentication**: Exchange credentials for `access_token`
4. **Protected Routes**: Use token in Authorization header for protected endpoints

## Development Guidelines

### Backend
- Use TypeScript for type safety
- Implement error handling in all controllers
- Log all important operations
- Use middleware for cross-cutting concerns

### Frontend
- Use React hooks for state management
- Implement error boundaries for error handling
- Use TypeScript for component props
- Follow responsive design principles

### Common
- Keep logging middleware reusable
- Centralize configuration in constants
- Use HTTP client interceptors for token injection

## Build & Deployment

**Build Backend:**
```bash
cd backend
npm run build
npm start
```

**Build Frontend:**
```bash
cd frontend
npm run build
```

## Important Notes

- ✅ No personal names in commits
- ✅ No "Affordmed" in repository name (use roll number)
- ✅ Production-grade code with proper error handling
- ✅ All fields sent to logging API in lowercase
- ✅ Include API request/response screenshots in submission
- ✅ Include mobile and desktop screenshots for frontend

## Testing

Test the logging middleware:

```bash
# Get access token first
curl -X POST http://4.224.186.213/evaluation-service/auth \
  -H "Content-Type: application/json" \
  -d '{"clientID":"your-id","clientSecret":"your-secret"}'

# Create a log
curl -X POST http://localhost:5000/api/logs \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"stack":"backend","level":"info","package":"handler","message":"test message"}'
```

## Submission Checklist

- [ ] GitHub repository created with roll number
- [ ] All packages implemented per specification
- [ ] Logging middleware integrated throughout codebase
- [ ] Authentication flow implemented
- [ ] API endpoints working with test server
- [ ] Screenshots of API calls included
- [ ] Mobile and desktop UI screenshots included
- [ ] .gitignore configured correctly
- [ ] No plagiarism or shared credentials
- [ ] Production-grade code quality

## License

MIT

---

**Roll Number**: 2300321530123  
**Track**: Full Stack  
**Created**: June 2026
