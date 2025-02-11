import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For retrieving session ID
import axios from 'axios';
import Navbar from '../components/Navbar';

const FormPage = () => {
  const { sessionId } = useParams(); // Retrieve session ID from route params
  const Role = localStorage.getItem('Role'); // Retrieve role from localStorage
  const [tableData, setTableData] = useState([]);

  // Fetch session data for editing
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!Role || !sessionId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/${Role}/sessions/${sessionId}`);
        setTableData(response.data.entries || []);
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };
    
    fetchSessionData();
  }, [Role, sessionId]);

  const handleChange = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = parseInt(value) || 0;
    setTableData(updatedData);
  };

  const handleSubmit = async () => {
    if (!Role || !sessionId) {
      alert('Role or Session ID missing. Please refresh and try again.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/${Role}/sessions/${sessionId}`, { entries: tableData });
      alert('Session updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating session data. Please try again.');
    }
  };

  const totalCouvPrev = tableData.reduce((sum, row) => sum + (row.couvPrev || 0), 0);
  const totalCouvReal = tableData.reduce((sum, row) => sum + (row.couvReal || 0), 0);

  return (
    <div>
      <Navbar />
      <div className="table-container">
        <h2>Edit Session: {sessionId}</h2>
        <table className="table-input">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Couv Prévu</th>
              <th>% Couv Prévu</th>
              <th>Couv Réalisée</th>
              <th>% Couv Réalisée</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.zone}</td>
                <td>
                  <input
                    type="number"
                    value={row.couvPrev || ''}
                    onChange={(e) => handleChange(index, 'couvPrev', e.target.value)}
                    placeholder="Enter Couv Prévu"
                  />
                </td>
                <td>
                  {totalCouvPrev > 0 ? ((row.couvPrev / totalCouvPrev) * 100).toFixed(2) : '0.00'}%
                </td>
                <td>
                  <input
                    type="number"
                    value={row.couvReal || ''}
                    onChange={(e) => handleChange(index, 'couvReal', e.target.value)}
                    placeholder="Enter Couv Réalisée"
                  />
                </td>
                <td>
                  {totalCouvReal > 0 ? ((row.couvReal / totalCouvReal) * 100).toFixed(2) : '0.00'}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSubmit} className="save-button">Update Session</button>
      </div>
    </div>
  );
};

export default FormPage;
