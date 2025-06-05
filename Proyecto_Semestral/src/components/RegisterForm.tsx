import React, { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/Auth.css';

interface RegisterFormProps {
  onSuccess: () => void;
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onToggleForm }) => {
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
      if (target.name === 'name') {
        target.setCustomValidity('Completa este campo');
      } else if (target.name === 'password') {
        target.setCustomValidity('Ingresa una contraseña');
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(name, email, password, interests);
      const token = await authService.login(email, password);
      if (token) {
        localStorage.setItem('token', token);
        onSuccess();
      }
    } catch (err) {
      setError('Error');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="simple-error-message">{error}</div>}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onInvalid={handleInvalid}
            onInput={handleInput}
            required
            placeholder=""
            title=""
          />
        </div>
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
        <button type="submit" className="auth-button">Registrarse</button>
      </form>
      <p className="toggle-form">
        ¿Ya tienes una cuenta?{' '}
        <button type="button" onClick={onToggleForm}>Inicia sesión aquí</button>
      </p>
    </div>
  );
};

export default RegisterForm;