import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FormPage from './components/FormPage';
import DisplayPage from './components/DisplayPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2 className="logo">MERN App</h2>
          <div className="nav-links">
            <Link to="/">Form</Link>
            <Link to="/entries">Entries</Link>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/entries" element={<DisplayPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
