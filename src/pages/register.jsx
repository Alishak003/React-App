// src/pages/Register.jsx
import { useState } from "react";
import { GoogleLogo } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import "../css/register.css"
import { googleSignIn, register } from "../services/authService";
import { auth } from "../config/firebase-config";

export const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  console.log(auth?.currentUser?.email)

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    const result = await register(form); 
    if(result.success){
        navigate('/completeProfile')
    }
    else{
        setMessage(result.message)
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
          <h3>Join Us Today</h3>
          <p>Create an account to continue</p>
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
          <button type="submit">Register</button>
        </form>
        <hr />
        <button className="google-btn" onClick={handleGoogleLogin}>
          <GoogleLogo size={20} weight="fill" style={{ marginRight: '8px' }} />
          Sign up with Google
        </button>
        <p className="switch-auth">
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/")}
          >
            Sign in instead
          </span>
        </p>
      </div>
    </div>
  );
};
