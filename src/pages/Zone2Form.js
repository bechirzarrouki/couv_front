import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/form-page.css';
import Navbar from '../components/Navbar';

function FormPage() {
  const regions = ["Sousse", "Mahdia", "Kasserine", "Monastir", "Kairouan"];

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const initializeData = () => days.map((day) => ({ day, zone1: "", zone2: "" }));

  const [prevuDays, setPrevuDays] = useState(initializeData());
  const [realiseDays, setRealiseDays] = useState(initializeData());
  const [suppDays, setSuppDays] = useState(initializeData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/latest');
        if (response.data) {
          setPrevuDays(response.data.prevuDays || initializeData());
          setRealiseDays(response.data.realiseDays || initializeData());
          setSuppDays(response.data.suppDays || initializeData());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (table, dayIndex, field, value) => {
    const updateTable = (setTable, tableData) => {
      const updatedData = [...tableData];
      updatedData[dayIndex][field] = value;
      setTable(updatedData);
    };

    if (table === "prevu") updateTable(setPrevuDays, prevuDays);
    else if (table === "realise") updateTable(setRealiseDays, realiseDays);
    else if (table === "supp") updateTable(setSuppDays, suppDays);
  };

  const calculateCoverage = (data) => {
    return regions.map((region) => {
      const count = data.reduce((sum, day) =>
        sum + (day.zone1 === region ? 1 : 0) + (day.zone2 === region ? 1 : 0), 0);
      return { region, count };
    });
  };

  const preparePayload = () => {
    const couvPrevData = calculateCoverage(prevuDays);
    const couvRealData = calculateCoverage(realiseDays);
    const couvSuppData = calculateCoverage(suppDays);

    return {
      entries: regions.map((region, index) => ({
        zone: region,
        couvPrev: couvPrevData[index].count,
        couvReal: couvRealData[index].count,
        couvSupp: couvSuppData[index].count,
        percentageCouvPrev: (couvPrevData[index].count / (days.length * 2)) * 100, // Adjusted for 2 zones per day
        percentageCouvReal: (couvRealData[index].count / (days.length * 2)) * 100,
        percentageCouvSupp: (couvSuppData[index].count / (days.length * 2)) * 100,
      })),
      prevuDays,
      realiseDays,
      suppDays,
    };
  };

  const handleSubmit = async () => {
    const data = preparePayload();
    try {
      await axios.post('http://localhost:5000/api/zone2/save', data);
      console.log(data);
      alert('Data saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving data. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="table-container">
        {[
          { label: "Couv Prévu", data: prevuDays, table: "prevu" },
          { label: "Couv Réalisé", data: realiseDays, table: "realise" },
          { label: "Couv Supplémentaire", data: suppDays, table: "supp" }
        ].map(({ label, data, table }) => (
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
                      <select
                        value={data[index].zone1}
                        onChange={(e) => handleChange(table, index, "zone1", e.target.value)}
                      >
                        <option value="">Select Zone 1</option>
                        {regions.map((region) => <option key={region} value={region}>{region}</option>)}
                      </select>
                      <select
                        value={data[index].zone2}
                        onChange={(e) => handleChange(table, index, "zone2", e.target.value)}
                      >
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
        <button onClick={handleSubmit} className="save-button">Submit Data</button>
      </div>
    </div>
  );
}

export default FormPage;