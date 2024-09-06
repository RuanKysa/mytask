import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  async function registerUser() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/tasks');
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        alert('Weak password');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use');
      }
    }
  }

  async function loginUser() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tasks');
    } catch (error) {
      alert('Usuário não encontrado');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1 className="auth-title">{isLogin ? 'Login' : 'Register'}</h1>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth-button" onClick={isLogin ? loginUser : registerUser}>
          {isLogin ? 'Login' : 'Register'}
        </button>
        <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'register' : 'log in'}
        </button>
      </div>
    </div>
  );
}

export default Auth;
