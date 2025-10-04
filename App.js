// File: src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const socket = io('http://localhost:5000');

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      socket.on('new-insight', (data) => {
        // You could add a notification system here instead of alerts
        console.log('New insight received:', data);
      });
    }
    return () => socket.off('new-insight');
  }, [token]);

  const handleAuth = () => {
    setToken(localStorage.getItem('token'));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;