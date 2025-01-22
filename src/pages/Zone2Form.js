import React, { useState } from 'react';
import axios from 'axios';
import '../styles/form-page.css';
import Navbar from '../components/Navbar';

function FormPage() {
  const regions = ["Sousse", "Mahdia", "Kasserine", "Monastir", "Kairouan"];

  const [tableData, setTableData] = useState(
    regions.map(region => ({ region, couvPrev: 0, couvReal: 0 }))
  );

  const handleChange = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = parseInt(value) || 0;
    setTableData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/zone2/save', { data: tableData });
      alert(`Session saved successfully! ID: ${response.data.sessionId}`);
    } catch (error) {
      console.error(error);
      alert('Error saving data. Please try again.');
    }
  };

  const totalCouvPrev = tableData.reduce((sum, row) => sum + row.couvPrev, 0);
  const totalCouvReal = tableData.reduce((sum, row) => sum + row.couvReal, 0);

  return (
    <div>
      <Navbar />
      <div className="table-container">
        <h2>Réalisation Couverture Zone</h2>
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
                <td>{row.region}</td>
                <td>
                  <input
                    type="number"
                    value={row.couvPrev}
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
                    value={row.couvReal}
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
        <button onClick={handleSubmit} className="save-button">Save Data</button>
      </div>
    </div>
  );
}

export default FormPage;
