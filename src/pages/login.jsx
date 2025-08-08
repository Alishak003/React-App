import { useState } from 'react';
import {googleSignIn, login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // Make sure this path matches your file
import { ArrowArcRight, ArrowRight, GoogleLogo } from 'phosphor-react';

export const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/feed');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async(e) => {
      e.preventDefault();
      const result = await googleSignIn();
      if(result.success){
          navigate('/feed')
      }
      else{
          setMessage(result.message)
      }
    };

  return (
    <div className="login-parent-container">
      <div className="login-container">
        <h3>Welcome back!</h3>
        <p>Sign in to your account to continue</p>
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign In <ArrowRight/></button>
          
        </form>
        <hr />
        <button className="google-btn" onClick={handleGoogleLogin}>
        <GoogleLogo size={20} weight="fill" style={{ marginRight: '8px' }} />
        Sign in with Google
        </button>
        <p className="switch-auth">
          Don't have an account?{' '}
          <span className="link" onClick={() => navigate('/register')}>
            Register instead
          </span>
        </p>
      </div>
    </div>
  );
};
