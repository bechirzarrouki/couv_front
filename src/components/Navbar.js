import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css'; // Ensure the path is correct
import { isAuthenticated, getUserRole } from '../utils/auth'; // Import auth utilities

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Example utility to fetch the user's role (ensure this function works in your auth file)
  const role = getUserRole(); // e.g., 'admin', 'zone1', 'zone2', 'zone3'
  const handleLogout = () => {
    // Clear user session (example: clear token from localStorage)
    localStorage.clear();
    // Redirect to login page
    navigate('/');
  };

  // Role-based links
  const roleBasedLinks = {
    admin: (
      <>
        <Link to="/zone1">Zone 1 Form</Link>
        <Link to="/zone2">Zone 2 Form</Link>
        <Link to="/zone3">Zone 3 Form</Link>
        <Link to="/display">Entries</Link>
        <Link to="/create-user">Create User</Link>
        <Link to="/zone1dashboard">Zone 1 Dashboard</Link>
        <Link to="/zone2dashboard">Zone 2 Dashboard</Link>
        <Link to="/zone3dashboard">Zone 3 Dashboard</Link>
      </>
    ),
    zone1: (
      <>
        <Link to="/zone1">Zone 1 Form</Link>
        <Link to="/display">Entries</Link>
        <Link to="/zone1dashboard">Zone 1 Dashboard</Link>
      </>
    ),
    zone2: (
      <>
        <Link to="/zone2">Zone 2 Form</Link>
        <Link to="/display">Entries</Link>
        <Link to="/zone2dashboard">Zone 2 Dashboard</Link>
      </>
    ),
    zone3: (
      <>
        <Link to="/zone3">Zone 3 Form</Link>
        <Link to="/display">Entries</Link>
        <Link to="/zone3dashboard">Zone 3 Dashboard</Link>
      </>
    ),
  };

  return (
    isAuthenticated() && ( // Ensure the user is authenticated
      <nav className="navbar">
        <h2 className="logo">MERN App</h2>

        {/* Mobile Toggle Button */}
        <div
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>

        {/* Navbar Links */}
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {roleBasedLinks[role]} {/* Render role-specific links */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    )
  );
};

export default Navbar;
