# Easy Generator - Authentication System

A full-stack authentication system with React frontend and NestJS backend, featuring JWT tokens, automatic refresh, rate limiting, and comprehensive testing.

## 📁 Project Structure

```
EasyGeneratorAuthProject/
├── easy-generator-task-be/    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── content/           # Content module
│   │   ├── users/             # Users module
│   │   └── config/            # Configuration
│   ├── test/                  # E2E tests
│   └── README.md              # Backend documentation
│
├── easy-generator-task-fe/    # React Frontend
│   ├── src/
│   │   ├── api/               # Axios configuration
│   │   ├── components/        # React components
│   │   ├── contexts/          # State management
│   │   ├── services/          # API services
│   │   └── types/             # TypeScript types
│   └── README.md              # Frontend documentation
│
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd easy-generator-task-be
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/easy-generator-auth
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_LOCAL_URL=http://localhost:5173
```

4. Start MongoDB:
```bash
# If running locally
mongod
```

5. Run the backend:
```bash
npm run start:dev
```

Backend will be available at: `http://localhost:3000`
API Docs (Swagger): `http://localhost:3000/swagger`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd easy-generator-task-fe
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

4. Run the frontend:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## ✨ Key Features

### Backend Features
- ✅ JWT authentication with refresh tokens
- ✅ Cookie-based authentication (HTTP-only)
- ✅ Rate limiting (100 req/15 min)
- ✅ Password validation
- ✅ MongoDB integration
- ✅ Swagger API documentation
- ✅ Unit tests with Jest
- ✅ CORS configuration

### Frontend Features
- ✅ User registration and login
- ✅ Form validation with Zod
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ Persistent login state
- ✅ Modern UI with CSS
- ✅ Error handling
- ✅ Axios interceptors

## 🧪 Testing

### Backend Tests
```bash
cd easy-generator-task-be
npm test              # Run all tests
npm run test:cov      # Coverage report
npm run test:watch    # Watch mode
```

### Frontend Tests
```bash
cd easy-generator-task-fe
npm test              # Run tests
npm run test:watch    # Watch mode
```

## 📚 Documentation

- **Backend API**: See [easy-generator-task-be/README.md](easy-generator-task-be/README.md)
- **Frontend**: See [easy-generator-task-fe/README.md](easy-generator-task-fe/README.md)
- **Swagger Docs**: http://localhost:3000/swagger (dev mode)

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing
   - Strong password requirements
   - No password storage in plain text

2. **Token Security**
   - Short-lived access tokens (15 mins)
   - Long-lived refresh tokens (7 days)
   - HTTP-only cookies
   - Token revocation on logout

3. **Rate Limiting**
   - Global: 100 requests per 15 minutes
   - Protection against brute force

4. **Input Validation**
   - Client-side and server-side validation
   - Class-validator decorators
   - Type-safe DTOs

## 🔄 Authentication Flow

1. **Sign Up/Login**: User credentials → Backend validates → Tokens generated
2. **Protected Request**: Request with expired token → 401 error
3. **Auto Refresh**: Interceptor catches 401 → Calls `/auth/refresh`
4. **Retry**: New token received → Original request retried
5. **Success**: User continues working seamlessly

## 🛠️ Technologies

### Backend
- NestJS
- TypeScript
- MongoDB + Mongoose
- Passport.js + JWT
- Bcrypt
- Swagger
- Jest
- Express Rate Limit

### Frontend
- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Axios

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/easy-generator-auth
JWT_SECRET=your-secret-key
FRONTEND_LOCAL_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🤝 Contributing

This is a private project. Please follow the coding standards and test your changes.
