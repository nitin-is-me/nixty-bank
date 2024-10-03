"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const router = useRouter();

  const handleRedirect = async (e) => {
    e.preventDefault();
    setLoadingRedirect(true);
    router.push('/auth/signup');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      return setError('Fill both fields');
    }
    if (username.includes(' ') || password.includes(' ')) {
      return setError('Spaces are not allowed in username or password');
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/auth/login', { username, password }, {
        withCredentials: true
      });

      if (response.data === 'Logged in successfully') {
        setError('');
        router.push('/dashboard');
      } else {
        setError(response.data);
        setMessage('');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" >
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body ">
            {/* Logo Section */}
            <div className="text-center" style={{ backgroundColor: '#343a40', padding: '20px', borderRadius: '0.5rem' }}>
              <h1 className='text-white mb-0'>Nixty Bank</h1>
            </div>

            {/* Form Section */}
            <h3 className="text-center mb-4 mt-4">Log In</h3>
            <form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={handleLogin}
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-white" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Log In'
                )}
              </button>
              <p className="mt-3 text-center">
                Don't have an account? 
                <a
                  href="#"
                  onClick={handleRedirect}
                  className="link-primary ms-2"
                  style={{ pointerEvents: loadingRedirect ? 'none' : 'auto' }}
                >
                  {loadingRedirect ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    'Signup'
                  )}
                </a>
              </p>
              <span className="text-danger d-block text-center">{error}</span>
              <span className="text-success d-block text-center">{message}</span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
