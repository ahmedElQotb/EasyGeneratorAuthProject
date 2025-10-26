import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { usersService } from '../services/usersService';

export default function Home() {
  const navigate = useNavigate();
  const { logout: logoutContext } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogout = async () => {
    try {
      await authService.logout();
      logoutContext();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGetUsername = async () => {
    try {
      setError('');
      const data = await usersService.getUsername();
      setUsername(data.name);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to fetch username');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the application</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="username-section">
          <button onClick={handleGetUsername} className="btn-secondary">
            Say My Name
          </button>
          {username && (
            <div className="username-display">
              <strong>Your name:</strong> {username}
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
}
