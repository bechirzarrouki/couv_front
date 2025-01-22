import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import '../App.css';
import Navbar from '../components/Navbar';
import {getUserRole } from '../utils/auth';
const DisplayPage = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate(); // Initialize navigation
  const Role=getUserRole();
  // Fetch all sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if(Role==='admin'){
          const response = await axios.get(`http://localhost:5000/api/users/all-zones`);
          setSessions(response.data);
        }else{
        const response = await axios.get(`http://localhost:5000/api/${Role}/sessions`);
        setSessions(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSessions();
  }, );

  // Handle session delete
  const handleDeleteSession = async (sessionId,role) => {
    try {
      if(Role==='admin'){
        await axios.delete(`http://localhost:5000/api/${role}/sessions/${sessionId}`);
        alert('Session deleted successfully!');
        setSessions(sessions.filter(session => session._id !== sessionId));
      }else{
      await axios.delete(`http://localhost:5000/api/${Role}/sessions/${sessionId}`);
      alert('Session deleted successfully!');
      setSessions(sessions.filter(session => session._id !== sessionId));
    }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Navigate to the FormPage with session ID for editing
  const handleEditSession = (sessionId,role) => {
    if(Role==='admin'){
    navigate(`/edit-session/${sessionId}/${role}`);
    }else{
      navigate(`/edit-session/${sessionId}/${Role}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="display-page">
        <h1 className="page-title">Formulaires</h1>
        <div className="sessions-container">
          {sessions.map(session => (
            <div className="session-card" key={session._id}>
              <h2 className="session-id">Session ID: {session._id}</h2>
              <p className="session-date">Created At: {new Date(session.createdAt).toLocaleString()}</p>
              <div className="session-actions">
                <button className="delete-button" onClick={() => handleDeleteSession(session._id,session.zone)}>Delete</button>
                <button className="update-button" onClick={() => handleEditSession(session._id,session.zone)}>Update</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
