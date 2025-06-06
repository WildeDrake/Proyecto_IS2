import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { interestsService } from '../services/interestsService';
import '../styles/Auth.css';

interface Interest {
  id: number;
  name: string;
  temp_min?: number;
  temp_max?: number;
  humidity_min?: number;
  humidity_max?: number;
}

interface RegisterFormProps {
  onSuccess: () => void;
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar intereses disponibles del backend
    const loadInterests = async () => {
      try {
        const interests = await interestsService.getAllInterests();
        setAvailableInterests(interests);
      } catch (err) {
        console.error('Error al cargar intereses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInterests();
  }, []);

  const handleInterestChange = (interestId: number) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
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
    setError('');
    
    try {
      // Registrar usuario con intereses
      await authService.register(name, email, password, selectedInterests);
      
      // Hacer login automático después del registro
      const token = await authService.login(email, password);
      if (token) {
        localStorage.setItem('token', token);
        onSuccess();
      }
    } catch (err: any) {
      // Mostrar el mensaje de error específico del backend
      setError(err.message || 'Error al registrar usuario');
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
          {loading ? (
            <p>Cargando intereses...</p>
          ) : (
            <div className="interests-grid">
              {availableInterests.map((interest) => (
                <label key={interest.id} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.id)}
                    onChange={() => handleInterestChange(interest.id)}
                  />
                  {interest.name}
                </label>
              ))}
            </div>
          )}
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