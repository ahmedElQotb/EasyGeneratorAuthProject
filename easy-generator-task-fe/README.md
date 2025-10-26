# Easy Generator - Frontend Application

A modern React + TypeScript frontend application with authentication, protected routes, and automatic token refresh.

## Features

- **Authentication**
  - User registration with validation
  - User login
  - Protected routes
  - Automatic logout on session expiry
  - Persistent login state
  
- **User Interface**
  - Clean and modern design
  - Form validation with error messages
  - Password requirements display
  - Responsive layout
  
- **Automatic Token Refresh**
  - Auto-refresh on 401 errors
  - Request queuing during refresh
  - Automatic retry on refresh success
  - Logout on refresh failure
  
- **State Management**
  - React Context for authentication
  - LocalStorage for persistence

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Running backend server (port 3000)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EasyGeneratorAuthProject/easy-generator-task-fe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Sign Up

1. Navigate to the sign-up page
2. Fill in:
   - Name (minimum 3 characters)
   - Email (valid email format)
   - Password with:
     - At least 8 characters
     - At least one letter (upper or lower)
     - At least one number
     - At least one special character
3. Click "Sign Up"
4. You'll be redirected to the home page

### Sign In

1. Navigate to the sign-in page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the home page

### Home Page

- Click "Get Quote" to fetch a random quote (requires authentication)
- Click "Logout" to end your session
- If logout fails, a retry prompt will appear

### Protected Routes

- The home page is protected and requires authentication
- If not logged in, you'll be redirected to the sign-in page
- Session persists across page refreshes

## Project Structure

```
src/
├── api/
│   └── axiosInstance.ts    # Centralized axios with interceptors
├── components/
│   ├── SignUp.tsx          # Registration form
│   ├── SignIn.tsx          # Login form
│   └── Home.tsx            # Protected home page
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── services/
│   ├── authService.ts      # Auth API calls
│   └── contentService.ts   # Content API calls
├── types/
│   └── auth.types.ts       # TypeScript interfaces
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
└── App.css                 # Global styles
```

## Features in Detail

### Automatic Token Refresh

The application uses an Axios interceptor to automatically refresh tokens:

1. **401 Error Handling**: When any request returns 401 (except auth endpoints)
2. **Token Refresh**: Automatically calls `/auth/refresh`
3. **Request Queuing**: Queues failed requests while refreshing
4. **Retry Logic**: Retries original requests after successful refresh
5. **Automatic Logout**: Redirects to sign-in if refresh fails

### Password Validation

**Frontend Validation** (real-time):
- Minimum 8 characters
- At least one letter (any case)
- At least one number
- At least one special character

**Backend Validation** (server-side):
- Same requirements as frontend
- Returns detailed error messages

### Protected Routes

Uses React Router's `ProtectedRoute` component:
- Checks authentication state from Context
- Redirects to sign-in if not authenticated
- Preserves intended destination for post-login redirect

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3000 |

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **CSS** - Styling

## API Integration

The frontend communicates with the backend REST API:

- **Authentication**: `/auth/signUp`, `/auth/signIn`, `/auth/refresh`, `/auth/logout`
- **Content**: `/content/quote`

All API calls include credentials (cookies) for authentication.

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Troubleshooting

### "Failed to fetch" errors
- Ensure the backend server is running on port 3000
- Check that `VITE_API_URL` is correctly set in `.env`

### "401 Unauthorized" errors
- Token may have expired - try logging in again
- Check browser console for detailed error messages

### CORS errors
- Ensure backend has CORS enabled for `http://localhost:5173`
- Check that credentials are included in requests

## License

UNLICENSED
