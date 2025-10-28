import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UploadDocument from './components/UploadDocument';
import SearchDocument from './components/SearchDocument';
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/upload" element={<PrivateRoute><UploadDocument /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><SearchDocument /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

