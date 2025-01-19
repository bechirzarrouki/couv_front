import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FormPage from './pages/FormPage';
import DisplayPage from './pages/DisplayPage';
import CreateUserPage from './pages/CreateUserPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import './styles/global.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar/>

        <main>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/entries" element={<DisplayPage />} />
            <Route path="/create-user" element={<CreateUserPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
