import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateOTP, validateOTP } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await generateOTP(mobileNumber);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
        debugger
      const response = await validateOTP(mobileNumber, otp);
      console.log('Validate OTP Response:', response);
      
      if (response.status && response.data && response.data.token) {
        console.log('Login Response:', response.data);
        console.log('Login Response:', response.data.token);
        console.log('Login Response:', response.data.user_id);
        console.log('Login Response:', response.data.user_name);
        console.log('Login Response:', response.data.roles);
        login(
          response.data.token, 
          mobileNumber,
          response.data.user_id || '',
          response.data.user_name || '',
          response.data.roles || []
        );
        navigate('/');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>AllSoft Document Management</h2>
          <p className="text-muted">Sign in to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {step === 'mobile' ? (
          <div className="login-form">
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">
                Mobile Number
              </label>
              <input
                type="text"
                className="form-control"
                id="mobileNumber"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength="10"
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="login-form">
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                Enter OTP
              </label>
              <input
                type="text"
                className="form-control"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
              />
            </div>
            <div className="mb-3 text-center">
              <p className="text-muted small">
                OTP sent to {mobileNumber}
              </p>
              <button
                className="btn btn-link btn-sm"
                onClick={() => setStep('mobile')}
              >
                Change Number
              </button>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleValidateOTP}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

