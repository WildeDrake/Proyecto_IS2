// filepath: c:\Users\Gaspar_Jimenez\Documents\IS2\Proyecto_IS2\Proyecto_Semestral\src\components\LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Auth.css';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await authService.login(email, password);
      if (token) {
        localStorage.setItem('token', token);
        onSuccess();
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Iniciar Sesión</button>
      </form>
      <p className="toggle-form">
        ¿No tienes una cuenta?{' '}
        <button onClick={() => navigate('/register')}>Regístrate aquí</button>
      </p>
    </div>
  );
};

export default LoginForm;