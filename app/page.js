'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Letran Portal</h1>
      <p style={styles.subtitle}>Select your login type</p>
      <div style={styles.buttonContainer}>
        <button onClick={() => router.push('/login/teacher')} style={styles.button}>Teacher Login</button>
        <button onClick={() => router.push('/login/student')} style={styles.button}>Student Login</button>
      </div>
      <footer style={styles.footer}>
        &copy; 2025 Colegio de San Juan de Letran
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '50px',
    color: '#777',
    fontSize: '14px',
  },
};
