import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import '../styles/Dashboard.css';

interface UserProfile {
  name: string;
  email: string;
  interests: string[];
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    interests: []
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    name: '',
    email: '',
    interests: []
  });
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await userService.getProfile();
      setProfile(userData);
      setEditedProfile(userData);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar el perfil');
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const updateData = {
        ...editedProfile,
        password: password || undefined
      };
      await userService.updateProfile(updateData);
      setProfile(editedProfile);
      setEditingProfile(false);
      setPassword('');
      setError(null);
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const availableInterests = [
    'Deporte al aire Libre',
    'Salir a Caminar',
    'Jugar Futbol',
    'Ir a la Playa',
    'Hacer Picnic',
    'Correr',
    'Jugar Tenis',
  ];

  if (!localStorage.getItem('token')) {
    navigate('/');
    return null;
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <button 
          className={`sidebar-button ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          Perfil
        </button>
        <button 
          className={`sidebar-button ${activeSection === 'interests' ? 'active' : ''}`}
          onClick={() => setActiveSection('interests')}
        >
          Intereses
        </button>
        <button 
          className="sidebar-button"
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </button>
      </div>
      
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeSection === 'profile' && (
          <div className="profile-section">
            <h2>Mi Perfil</h2>
            {!editingProfile ? (
              <>
                <div className="profile-info">
                  <p><strong>Nombre:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                </div>
                <button 
                  className="edit-button"
                  onClick={() => setEditingProfile(true)}
                >
                  Editar Perfil
                </button>
              </>
            ) : (
              <form className="profile-form" onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate();
              }}>
                <div className="form-group">
                  <label>Nombre</label>
                  <input 
                    type="text" 
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña (opcional)</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit">Guardar Cambios</button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingProfile(false);
                      setEditedProfile(profile);
                      setPassword('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        
        {activeSection === 'interests' && (
          <div className="interests-section">
            <h2>Mis Intereses</h2>
            <div className="interests-grid">
              {availableInterests.map((interest) => (
                <label key={interest} className="interest-item">
                  <input 
                    type="checkbox"
                    checked={editedProfile.interests.includes(interest)}
                    onChange={(e) => {
                      const newInterests = e.target.checked 
                        ? [...editedProfile.interests, interest]
                        : editedProfile.interests.filter(i => i !== interest);
                      setEditedProfile({
                        ...editedProfile,
                        interests: newInterests
                      });
                    }}
                  />
                  {interest}
                </label>
              ))}
            </div>
            <button onClick={handleProfileUpdate}>
              Actualizar Intereses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;