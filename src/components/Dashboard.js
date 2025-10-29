import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, mobileNumber, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <strong>AllSoft</strong> Document Management
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {userName || mobileNumber}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Dashboard</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 dashboard-card" onClick={() => navigate('/upload')}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-upload fs-1 text-primary"></i>
                </div>
                <h5 className="card-title">Upload Document</h5>
                <p className="card-text">Upload and manage your documents</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 dashboard-card" onClick={() => navigate('/search')}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-search fs-1 text-success"></i>
                </div>
                <h5 className="card-title">Search Documents</h5>
                <p className="card-text">Find documents using filters and tags</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 dashboard-card" onClick={() => navigate('/admin')}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-person-gear fs-1 text-warning"></i>
                </div>
                <h5 className="card-title">Admin Panel</h5>
                <p className="card-text">Manage users and settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

