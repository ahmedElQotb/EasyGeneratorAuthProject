# Easy Generator - Backend API

A secure NestJS backend application with JWT authentication, refresh tokens, rate limiting, and Swagger documentation.

## Features

- **Authentication System**
  - User registration and login
  - JWT access tokens (short-lived)
  - Refresh tokens (long-lived, stored in MongoDB)
  - Cookie-based authentication (HTTP-only cookies)
  - Password hashing with bcrypt
  
- **Content Management**
  - Protected content endpoints
  - Random quote generation
  
- **Security**
  - Rate limiting (100 requests per 15 minutes)
  - Password validation (min 8 chars, letter, number, special character)
  - Input validation with class-validator
  - CORS enabled for development
  
- **API Documentation**
  - Swagger/OpenAPI documentation
  - Available at `/swagger` in development mode
  
- **Testing**
  - Unit tests with Jest
  - Test coverage for services and controllers

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EasyGeneratorAuthProject/easy-generator-task-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/easy-generator-auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_LOCAL_URL=http://localhost:5173
```

4. Start MongoDB (if running locally):
```bash
# Using mongosh or mongod
mongod
```

5. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/signUp` - Register a new user
  - Body: `{ name: string, email: string, password: string }`
  - Returns: Success message
  - Cookies: Access token & Refresh token

- `POST /auth/signIn` - Login user
  - Body: `{ email: string, password: string }`
  - Returns: Success message
  - Cookies: Access token & Refresh token

- `POST /auth/refresh` - Refresh access token
  - Cookies: Refresh token
  - Returns: New access token

- `POST /auth/logout` - Logout user
  - Cookies: Refresh token
  - Clears all cookies

### Content

- `GET /content/quote` - Get a random quote
  - Authentication: Required (Bearer token)
  - Returns: `{ quote: string }`

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch
```

## API Documentation

When running in development mode, visit:
```
http://localhost:3000/swagger
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `FRONTEND_LOCAL_URL` | Frontend URL for CORS | http://localhost:5173 |

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dtos/         # Data transfer objects
│   ├── guards/       # Auth guards
│   ├── schemas/      # Refresh token schema
│   └── strategies/   # JWT strategy
├── config/           # Configuration files
├── content/          # Content module
├── users/            # Users module
└── main.ts           # Application entry point
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Bcrypt** - Password hashing
- **Swagger** - API documentation
- **Jest** - Testing framework
- **Express Rate Limit** - Rate limiting

