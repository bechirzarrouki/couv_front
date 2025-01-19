import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Make sure the path is correct

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">MERN App</h2>
      
      {/* Mobile Toggle Button */}
      <div
        className="navbar-toggle"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        ☰
      </div>

      {/* Navbar Links */}
      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/">Login</Link>
        <Link to="/form">Form</Link>
        <Link to="/entries">Entries</Link>
        <Link to="/create-user">Create User</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;
