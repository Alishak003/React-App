// src/pages/Landing.jsx
import React from 'react';
import '../css/landing.css';
import { GoogleLogo } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { googleSignIn } from '../services/authService';

export const Landing = () => {
  const navigate = useNavigate();
  const handleGoogleLogin = async(e) => {
    e.preventDefault();
    const result = await googleSignIn();
    if(result.success){
        navigate('/feed')
    }
    else{
        // setMessage(result.message)
    }
  };

  return (
    <div className="landing-parent-container">
        <div className="landing-container">
            <img className='landing-image' src='lading-page-bg.jpg'/>
          <h1 className="landing-heading">Welcome to MiniLinkedIn</h1>
          <div className="button-group">
            <div>
                <button className="google-btn" onClick={handleGoogleLogin}>
                  <GoogleLogo size={20} weight="bold" style={{ marginRight: '8px' }} />
                  Sign in with Google
                </button>
            </div>
            <div>
                <button className="email-btn" onClick={() => navigate('/login')}>
                  Sign in with Email
                </button>
            </div>

          </div>
          <p className="register-text">
            Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
          </p>
        </div>
    </div>
  );
};
