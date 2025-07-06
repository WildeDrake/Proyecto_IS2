import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  searchCountry?: string;
  setSearchCountry?: (country: string) => void;
  onSearch?: (e: React.FormEvent) => void;
  showSearchBar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  searchQuery = '',
  setSearchQuery = () => {},
  searchCountry = '',
  setSearchCountry = () => {},
  onSearch = () => {},
  showSearchBar = true
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const handleAuthAction = () => {
    if (isAuthenticated) {
      localStorage.removeItem('token');
      localStorage.clear();
      setIsAuthenticated(false);
      window.location.assign('/');
    } else {
      // Navegar a la landing page con estado para mostrar login
      navigate('/', { state: { showLogin: true } });
    }
  };

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/images/logo.png" alt="Tu Clima" className="navbar-logo" />
      </div>
      
      {showSearchBar && (
        <form className="search-container" onSubmit={onSearch}>
          <input 
            type="text" 
            placeholder="Buscar ciudad..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="País (ej: CL, US)" 
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            maxLength={2}
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
      )}
      
      <div className="navbar-actions">
        <button 
          className="btn-login" 
          onClick={handleAuthAction}
        >
          {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
        </button>
        {isAuthenticated && (
          <button 
            className="btn-profile"
            onClick={handleProfileClick}
          >
            Mi Perfil
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;