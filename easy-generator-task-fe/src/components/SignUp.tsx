import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const signUpSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter (upper or lower)')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError('');
      await authService.signUp(data);
      login();
      navigate('/home');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      const formattedError = Array.isArray(errorMessage) 
        ? errorMessage.join(', ') 
        : errorMessage || 'Sign up failed. Please try again.';
      setError(formattedError);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" {...register('name')} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register('password')} />
          {errors.password && errors.password.message && (
            <ul className="error-list">
              {typeof errors.password.message === 'string' 
                ? errors.password.message.split(', ').map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))
                : <li>{errors.password.message}</li>
              }
            </ul>
          )}
          <div className="password-requirements">
            <small>Password must contain:</small>
            <ul>
              <li>At least 8 characters</li>
              <li>At least one letter (upper or lower)</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Sign Up
        </button>
      </form>

      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
}
