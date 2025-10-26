import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';

export default function Home() {
  const navigate = useNavigate();
  const { logout: logoutContext } = useAuth();
  const [quote, setQuote] = useState<string>('');
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

  const handleGetQuote = async () => {
    try {
      setError('');
      const data = await contentService.getQuote();
      setQuote(data.quote);
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to fetch quote');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to the application</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="quote-section">
          <button onClick={handleGetQuote} className="btn-secondary">
            Get Quote
          </button>
          {quote && (
            <div className="quote-display">
              <strong>Quote:</strong> {quote}
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
