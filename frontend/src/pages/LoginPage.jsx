import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await api.post('/auth/register', form);
      }
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <div style={{ marginBottom: '0.5rem' }}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange} style={{ width: '100%' }}>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          {isRegister ? 'Register & Login' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => setIsRegister((v) => !v)}
        style={{ marginTop: '1rem', width: '100%' }}
      >
        {isRegister ? 'Have an account? Login' : 'New user? Register'}
      </button>
    </div>
  );
}
