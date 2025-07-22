import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig.jsx';  

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/login', { email, password });
      
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('authEmail', response.data.email);
      localStorage.setItem('authName', response.data.name);
       
      navigate('/dashboard'); 
    } catch (err) {
       
      setError(err.response?.data?.error || 'Invalid credentials or server error');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-logo">workasana</h1>
        <h2 className="auth-heading">Log in to your account</h2>
        <p className="auth-subheading">Please enter your details</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>
        <p className="auth-link-text">Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
