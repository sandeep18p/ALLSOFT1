import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { userName, mobileNumber, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUserCreation = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please fill all fields');
      return;
    }

    // This is a static admin interface - in real implementation, this would call an API
    setMessage('User creation would be implemented with backend API');
    console.log('User created:', { username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div className="admin-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <strong>AllSoft</strong> Document Management
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">{userName || mobileNumber}</span>
            <button className="btn btn-link btn-sm me-2" onClick={() => navigate('/')}>
              Home
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h2 className="mb-4">Admin Panel</h2>
                <p className="text-muted mb-4">Create new users for the system</p>

                {message && (
                  <div className={`alert ${message.includes('would') ? 'alert-info' : message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleUserCreation}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Create User
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <p className="text-muted small">
                    <strong>Note:</strong> This is a static admin interface. In a production
                    environment, this would be connected to the backend API for user
                    management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

