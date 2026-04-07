import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { redirectAfterAuth } from '../utils/redirectAfterAuth';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', formData);
      const { token, user } = response.data;
      
      login(user, token);
      toast.success('Login successful!');
      
      // Redirect to the page user was on before login
      redirectAfterAuth(navigate);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-card shadow-card p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-dark mb-3">
              Welcome Back
            </h2>
            <p className="text-base text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-end">
              <Link 
                to="/request-password-reset" 
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-primary hover:text-primary-hover transition-colors duration-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
