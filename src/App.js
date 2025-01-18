import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FormPage from './components/FormPage';
import DisplayPage from './components/DisplayPage';
import CreateUserPage from './components/CreateUserPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2 className="logo">MERN App</h2>
          <div className="nav-links">
            <Link to="/">Login</Link>
            <Link to="/form">Form</Link>
            <Link to="/entries">Entries</Link>
            <Link to="/create-user">Create User</Link>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/entries" element={<DisplayPage />} />
            <Route path="/create-user" element={<CreateUserPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
