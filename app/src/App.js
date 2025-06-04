import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import DashboardVen from './components/DashboardVen';
import DashboardAdmin from './components/DashboardAdmin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="App">
      
      {user ? (
        user.is_admin ? (
          <DashboardAdmin user={user} onLogout={handleLogout} />
        ) : (
          <DashboardVen user={user} onLogout={handleLogout} />
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}

    </div>
  );
}

export default App;