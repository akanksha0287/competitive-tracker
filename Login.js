// File: src/components/Login.js
import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await (isRegister ? authAPI.register(formData) : authAPI.login(formData));
      localStorage.setItem('token', res.data.token);
      onAuth();
    } catch (err) {
      alert(err.response?.data?.msg || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <form onSubmit={handleSubmit} style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
        </button>
        
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginTop: '10px', 
            background: 'transparent', 
            color: '#007bff', 
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
};

export default Login;