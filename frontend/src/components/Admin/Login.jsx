import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/api';
import { useAdmin } from '../../context/AdminContext';
import './Admin.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token, res.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-logo">
          <h1>ANAX INVENTIONS</h1>
          <p>Admin Panel</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@anaxinventions.com"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;