import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Auth.css';

interface LoginFormProps {
  onSuccess: () => void;
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onToggleForm }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    // Para campos de email, personalizar el mensaje según el tipo de error
    if (target.type === 'email') {
      const value = target.value;
      if (!value) {
        target.setCustomValidity('Completa este campo');
      } else if (!value.includes('@')) {
        target.setCustomValidity('Incluye una @ en el email');
      } else if (value.indexOf('@') === value.length - 1) {
        target.setCustomValidity('Completa el email correctamente');
      } else {
        target.setCustomValidity('Formato de email inválido');
      }
    } else {
      if (target.name === 'password') {
        target.setCustomValidity('Ingresa tu contraseña');
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = await authService.login(email, password);
      if (token) {
        localStorage.setItem('token', token);
        onSuccess();
        window.location.assign('/');
      }
    } catch (err: any) {
      // Mostrar el mensaje de error específico del backend
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="simple-error-message">{error}</div>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onInvalid={handleInvalid}
            onInput={handleInput}
            required
            placeholder=""
            title=""
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onInvalid={handleInvalid}
            onInput={handleInput}
            required
            placeholder=""
            title=""
          />
        </div>
        <button type="submit" className="auth-button">Continuar</button>
      </form>
      <p className="toggle-form">
        ¿No tienes una cuenta?{' '}
        <button type="button" onClick={() => {
          navigate('/register');
        }}>Regístrate aquí</button>
      </p>
    </div>
  );
};

export default LoginForm;