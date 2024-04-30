import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css'; 

const NavBar = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook do react-router-dom

  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpa o token de autenticação
    navigate('/login'); // Redireciona para a página de login
  };
  

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo">Teste diel</Link>
      <Link to="/tags">Gerenciar Tags</Link>
      <div className="dropdown">
        <Link onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Sair</Link>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <Link to="/" onClick={handleLogout}>Sair</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
