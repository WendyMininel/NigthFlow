import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import headerImage from './header-image.jpg';

const Header = () => {
  const location = useLocation();
  const [userArea, setUserArea] = useState('cliente');

  useEffect(() => {
    const savedArea = localStorage.getItem('userArea');
    if (savedArea) {
      setUserArea(savedArea);
    }

    const handleAreaChange = () => {
      const updatedArea = localStorage.getItem('userArea');
      if (updatedArea) {
        setUserArea(updatedArea);
      }
    };

    window.addEventListener('userAreaChanged', handleAreaChange);
    return () => window.removeEventListener('userAreaChanged', handleAreaChange);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <img src={headerImage} alt="Header" className="header-image" />
      <div className="header-overlay">
        <div className="header-content">
          <div className="header-left">
            <h1 className="site-title">NightFlow</h1>
            <p className="tagline">Onde a noite ganha ritmo</p>
          </div>
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Eventos
            </Link>
            {userArea === 'organizador' ? (
              <>
                <Link to="/criar-evento" className={`nav-link ${isActive('/criar-evento')}`}>
                  Criar Evento
                </Link>
                <Link to="/meus-eventos" className={`nav-link ${isActive('/meus-eventos')}`}>
                  Meus Eventos
                </Link>
                <Link to="/dados" className={`nav-link ${isActive('/dados')}`}>
                  Dados
                </Link>
                <Link to="/perfil" className={`nav-link profile-icon ${isActive('/perfil')}`}>
                  👤
                </Link>
              </>
            ) : (
              <>
                <Link to="/meus-ingressos" className={`nav-link ${isActive('/meus-ingressos')}`}>
                  Meus Ingressos
                </Link>
                <Link to="/meu-carrinho" className={`nav-link ${isActive('/meu-carrinho')}`}>
                  Meu Carrinho
                </Link>
                <Link to="/perfil" className={`nav-link profile-icon ${isActive('/perfil')}`}>
                  👤
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;