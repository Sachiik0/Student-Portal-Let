// app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        if (data.redirectUrl) router.push(data.redirectUrl);
        else setError('Redirection URL is missing');
      } else setError(data.error || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.leftContainer}>
        <img src="/path-to-logo.png" alt="Logo" style={styles.logo} />
        <h2>Welcome to Letran Faculty Portal</h2>
        <p>Before you get started, you must log in to your E-link account.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>
        <p style={styles.date}>Today is January 16, 2025</p>
        <footer style={styles.footer}>
          &copy; 2025 All Rights Reserved.
          <br />
          Information Technology Services Department
        </footer>
      </div>
      <div style={styles.rightContainer}>
        <div style={styles.imagesContainer}>
          <img src="/path-to-image1.jpg" alt="Event 1" style={styles.image} />
          <img src="/path-to-image2.jpg" alt="Event 2" style={styles.image} />
          <img src="/path-to-image3.jpg" alt="Event 3" style={styles.image} />
        </div>
        <div style={styles.textOverlay}>
          <h2>Good Evening</h2>
          <p>Manila, Philippines</p>
          <p>&copy; 2024 Colegio de San Juan de Letran</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    height: '100vh',
  },
  leftContainer: {
    width: '40%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100px',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '300px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '5px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
  },
  date: {
    marginTop: '20px',
    color: '#555',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
  },
  rightContainer: {
    width: '60%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imagesContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  image: {
    width: '150px',
    height: '100px',
    objectFit: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    bottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
};
