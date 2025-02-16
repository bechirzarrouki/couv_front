import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/form-page.css';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

function FormPage() {
  const { sessionId,Role } = useParams();
  const region1 = [
    "Tunis", "Ben Arous", "Ariana", "Bizerte", "Nabeul", "Manouba", "Zaghouan",
    "Beja", "Monastir", "Enfidha (Sousse)", "Siliana", "Kef", "Kairouan", "Jendouba"
  ];
  const region2 = ["Sousse", "Mahdia", "Kasserine", "Monastir", "Kairouan"];
  const region3= ["Sfax", "Mednine", "Kebili", "Tozeur", "Sidi Bouzid", "Gafsa", "Mahdia"];

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const initializeData = () => days.map(() => ({ zone1: "", zone2: "" }));

  const [prevuData, setPrevuData] = useState(initializeData());
  const [realiseData, setRealiseData] = useState(initializeData());
  const [suppData, setSuppData] = useState(initializeData());
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        var regions;
        if (Role === "zone1") {
          setRegions(region1);
        } else if (Role === "zone2") {
          setRegions(region2);
        } else if (Role === "zone3") {
          setRegions(region3);
        } else {
          regions = []; // default if Role doesn't match
        }
        const response = await axios.get(`http://localhost:5000/api/${Role}/sessions/${sessionId}`);
        const { prevuDays, realiseDays, suppDays } = response.data;

        setPrevuData(prevuDays.length ? prevuDays : initializeData());
        setRealiseData(realiseDays.length ? realiseDays : initializeData());
        setSuppData(suppDays.length ? suppDays : initializeData());
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  const handleChange = (table, dayIndex, field, value) => {
    const updatedData = table === "prevu" 
      ? [...prevuData] 
      : [...realiseData];
      
    updatedData[dayIndex][field] = value;

    if (table === "prevu") setPrevuData(updatedData);
    else setRealiseData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/${Role}/sessions/${sessionId}`, {
        entries: [prevuData, realiseData, suppData],
      });
      alert('Session updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating session data. Please try again.');
    }
  };

  if (loading) return <p>Loading session data...</p>;

  return (
    <div>
      <Navbar />
      <div className="table-container">
        <h2>Edit Session: {sessionId}</h2>
        {[{ label: "Couv Prévu", data: prevuData, table: "prevu" },
          { label: "Couv Réalisé", data: realiseData, table: "realise" }].map(({ label, data, table }) => (
          <div key={table}>
            <h2>{label}</h2>
            <table className="table-input">
              <thead>
                <tr>{days.map((day) => <th key={day}>{day}</th>)}</tr>
              </thead>
              <tbody>
                <tr>
                  {days.map((_, index) => (
                    <td key={index}>
                      <select value={data[index].zone1} onChange={(e) => handleChange(table, index, "zone1", e.target.value)}>
                        <option value="">Select Zone 1</option>
                        {regions.map((region) => <option key={region} value={region}>{region}</option>)}
                      </select>
                      <select value={data[index].zone2} onChange={(e) => handleChange(table, index, "zone2", e.target.value)}>
                        <option value="">Select Zone 2</option>
                        {regions.map((region) => <option key={region} value={region}>{region}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {/* Read-only table for Couv Supplémentaire */}
        <div>
          <h2>Couv Supplémentaire</h2>
          <table className="table-input">
            <thead>
              <tr>{days.map((day) => <th key={day}>{day}</th>)}</tr>
            </thead>
            <tbody>
              <tr>
                {days.map((_, index) => (
                  <td key={index}>
                    <span>{suppData[index].zone1 || "-"}</span>
                    <br />
                    <span>{suppData[index].zone2 || "-"}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <button onClick={handleSubmit} className="save-button">Update Session</button>
      </div>
    </div>
  );
}

export default FormPage;