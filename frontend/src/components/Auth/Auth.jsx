import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { signInWithGoogle } from '../../firebase';
import './Auth.css';

const API_URL = 'https://anax-inventions.onrender.com/api/auth';

const Auth = ({ isOpen, onClose, adminMode = false }) => {
  const [panel, setPanel] = useState('signin');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAdminSignup, setShowAdminSignup] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) { setResetToken(token); setPanel('reset'); }
  }, []);

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLoginSuccess = (data) => {
    console.log('✅ Login Success:', data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.user.role === 'admin') {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/client-dashboard';
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin-register`, formData);
      setUserId(res.data.userId);
      setOtp('');
      setPanel('otp');
      showMessage('Verification code sent! Check console for OTP', 'success');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { showMessage('Enter 6-digit code'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-otp`, { userId, otp });
      
      // Check if token is returned (admin verification returns token directly)
      if (res.data.token) {
        // Auto login after verification
        handleLoginSuccess(res.data);
      } else {
        showMessage('Email verified! Please login.', 'success');
        setTimeout(() => { 
          setPanel('signin'); 
          setFormData({ fullName: '', email: formData.email || '', password: '' }); 
          setUserId(''); 
        }, 1500);
      }
    } catch (err) { 
      showMessage(err.response?.data?.message || 'Invalid code'); 
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { 
      showMessage('Enter email and password'); 
      return; 
    }
    
    console.log('🔐 Login attempt:', { email: formData.email });
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/login`, { 
        email: formData.email.trim(), 
        password: formData.password 
      });
      
      console.log('✅ Login response:', res.data);
      
      if (res.data.success) {
        handleLoginSuccess(res.data);
      } else {
        showMessage(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data);
      showMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const googleData = await signInWithGoogle();
      const res = await axios.post(`${API_URL}/google`, googleData);
      if (res.data.success) {
        handleLoginSuccess(res.data);
      } else {
        showMessage('Google login failed');
      }
    } catch (err) { 
      if (err.code !== 'auth/popup-closed-by-user') {
        showMessage('Google login failed'); 
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) { showMessage('Enter your email'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email: formData.email });
      if (res.data.userId) setUserId(res.data.userId);
      setPanel('forgot-otp'); 
      showMessage('Reset code sent! Check console', 'success');
    } catch (err) { 
      showMessage(err.response?.data?.message || 'Error'); 
    }
    setLoading(false);
  };

  const handleForgotOTPVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { showMessage('Enter 6-digit code'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-forgot-otp`, { email: formData.email, otp });
      if (res.data.resetToken) { 
        setResetToken(res.data.resetToken); 
        setPanel('reset'); 
        showMessage('Create new password.', 'success'); 
      }
    } catch (err) { 
      showMessage(err.response?.data?.message || 'Invalid code'); 
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) { 
      showMessage('Password 6+ chars'); 
      return; 
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password/${resetToken}`, { password: formData.password });
      showMessage('Password reset! Login.', 'success');
      setTimeout(() => { 
        setPanel('signin'); 
        setFormData({ fullName: '', email: '', password: '' }); 
        setResetToken(''); 
        setOtp(''); 
      }, 2000);
    } catch (err) { 
      showMessage(err.response?.data?.message || 'Reset failed'); 
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try { 
      await axios.post(`${API_URL}/resend-otp`, { userId }); 
      showMessage('New code sent! Check console', 'success'); 
    } catch (err) { 
      showMessage('Failed to resend'); 
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Mobile Header - Only Sign In */}
        <div className="auth-mobile-header">
          <h2 className="auth-mobile-brand">ANAX <span>INVENTIONS</span></h2>
          <div className="auth-mobile-tabs">
            <button className="auth-mobile-tab active">Sign In</button>
          </div>
        </div>

        {/* Sign In Panel */}
        <div className="auth-form-panel active">
          <div className="auth-form-inner">
            <div className="auth-form-title">
              <h2>Welcome <span>Back</span></h2>
              <p>{adminMode ? 'Admin Login' : 'Client Login'}</p>
            </div>

            {message.text && <div className={`auth-msg ${message.type}`}>{message.text}</div>}

            <AnimatePresence mode="wait">
              {panel === 'signin' && (
                <motion.form key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleLogin}>
                  
                  {/* Google Button - Only in Admin Mode */}
                  {adminMode && (
                    <>
                      <button type="button" className="auth-google-btn" onClick={handleGoogleLogin}>
                        <img src="https://www.google.com/favicon.ico" alt="G" className="g-icon" />
                        Continue with Google
                      </button>
                      <div className="auth-or-divider"><span>or</span></div>
                    </>
                  )}
                  
                  <div className="auth-field">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="your@email.com" onChange={handleChange} value={formData.email} required />
                  </div>
                  <div className="auth-field">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="••••••••" onChange={handleChange} value={formData.password} required />
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <p className="auth-forgot-link" onClick={() => { setPanel('forgot'); setMessage({ text: '', type: '' }); }}>
                    Forgot Password?
                  </p>
                </motion.form>
              )}
              {panel === 'otp' && (
                <motion.form key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleVerifyOTP}>
                  <p className="auth-hint">Enter code sent to <strong>{formData.email}</strong></p>
                  <div className="auth-field">
                    <input type="text" placeholder="000000" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="otp-input" autoFocus />
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </button>
                  <p className="auth-switch-link">No code? <span onClick={handleResendOTP}>Resend</span></p>
                </motion.form>
              )}
              {panel === 'forgot' && (
                <motion.form key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleForgotPassword}>
                  <p className="auth-hint">Enter email for reset code.</p>
                  <div className="auth-field">
                    <input type="email" name="email" placeholder="your@email.com" onChange={handleChange} required />
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Code'}
                  </button>
                  <p className="auth-switch-link"><span onClick={() => setPanel('signin')}>← Back</span></p>
                </motion.form>
              )}
              {panel === 'forgot-otp' && (
                <motion.form key="forgot-otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleForgotOTPVerify}>
                  <p className="auth-hint">Enter reset code.</p>
                  <div className="auth-field">
                    <input type="text" placeholder="000000" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="otp-input" autoFocus />
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </motion.form>
              )}
              {panel === 'reset' && (
                <motion.form key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleResetPassword}>
                  <p className="auth-hint">Create new password.</p>
                  <div className="auth-field">
                    <input type="password" name="password" placeholder="Min 6 chars" onChange={handleChange} required />
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Updating...' : 'Reset Password'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Secret Admin Signup - Only in admin mode */}
            {adminMode && (
              <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                {!showAdminSignup ? (
                  <p style={{ fontSize: '11px', color: '#999' }}>
                    First time?{' '}
                    <span 
                      onClick={() => setShowAdminSignup(true)} 
                      style={{ color: '#cc7722', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Create Admin Account
                    </span>
                  </p>
                ) : (
                  <form onSubmit={handleAdminRegister}>
                    <div className="auth-field">
                      <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required style={{ marginBottom: '8px' }} />
                    </div>
                    <div className="auth-field">
                      <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ marginBottom: '8px' }} />
                    </div>
                    <div className="auth-field">
                      <input type="password" name="password" placeholder="Password (min 6 chars)" onChange={handleChange} required style={{ marginBottom: '8px' }} />
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={loading} style={{ background: '#1d2e2a' }}>
                      {loading ? 'Creating...' : 'Create Admin Account'}
                    </button>
                    <p className="auth-switch-link"><span onClick={() => setShowAdminSignup(false)}>← Cancel</span></p>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sliding Overlay */}
        <div className="auth-overlay-panel">
          <div className="auth-overlay-content">
            <img src="/anax-logo.png" alt="ANAX" className="auth-overlay-logo" />
            <div className="auth-overlay-text">
              <h2>{adminMode ? 'Admin Portal' : 'Client Portal'}</h2>
              <p>
                {adminMode 
                  ? 'Login to manage clients, projects, and content.' 
                  : 'Login with credentials provided by Anax Inventions team.'}
              </p>
              {!adminMode && (
                <p style={{ fontSize: '10px', marginTop: '10px', opacity: 0.7 }}>
                  Don't have credentials? Contact us!
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;