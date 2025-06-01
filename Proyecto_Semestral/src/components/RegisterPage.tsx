import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const availableInterests = [
    'Deporte al aire Libre',
    'Salir a Caminar',
    'Jugar Futbol',
    'Ir a la Playa',
    'Hacer Picnic',
    'Correr',
    'Jugar Tenis',
  ];

  const handleInterestChange = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(name, email, password, interests);
      const token = await authService.login(email, password);
      if (token) {
        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="page-container">
      <div className="register-page-form">
        <h1>Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label>Intereses:</label>
            <div className="interests-grid">
              {availableInterests.map((interest) => (
                <label key={interest} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Registrarse</button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
          </div>
        </form>
        <p className="login-link">
          ¿Ya tienes una cuenta? <a onClick={() => navigate('/login')}>Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;