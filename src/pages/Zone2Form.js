import React, { useState } from 'react';
import axios from 'axios';
import '../styles/form-page.css';
import Navbar from '../components/Navbar';

function FormPage() {
  const regions = ["Sousse", "Mahdia", "Kasserine", "Monastir", "Kairouan"];

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const initializeData = () =>
    days.map(() => ({ zone1: "", zone2: "" }));

  const [prevuData, setPrevuData] = useState(initializeData());
  const [realiseData, setRealiseData] = useState(initializeData());

  const handleChange = (table, dayIndex, field, value) => {
    const updatedData = table === "prevu" ? [...prevuData] : [...realiseData];
    updatedData[dayIndex][field] = value;

    if (table === "prevu") {
      setPrevuData(updatedData);
    } else {
      setRealiseData(updatedData);
    }
  };

  const calculateCouvData = (data) => {
    return regions.map((region) => {
      const count = data.reduce(
        (sum, day) => sum + (day.zone1 === region ? 1 : 0) + (day.zone2 === region ? 1 : 0),
        0
      );
      return { region, count };
    });
  };

  const preparePayload = () => {
    const couvPrevData = calculateCouvData(prevuData);
    const couvRealData = calculateCouvData(realiseData);

    const payload = couvPrevData.map((item, index) => ({
      region: item.region,
      couvPrev: item.count,
      couvReal: couvRealData[index].count,
    }));

    return payload;
  };

  const handleSubmit = async () => {
    const data = preparePayload();

    try {
      const response = await axios.post('http://localhost:5000/api/zone2/save', { data });
      alert(`Data saved successfully! Session ID: ${response.data.sessionId}`);
    } catch (error) {
      console.error(error);
      alert('Error saving data. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="table-container">
        <h2>Couv Prévu</h2>
        <table className="table-input">
          <thead>
            <tr>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((_, index) => (
                <td key={index}>
                  <select
                    value={prevuData[index].zone1}
                    onChange={(e) =>
                      handleChange("prevu", index, "zone1", e.target.value)
                    }
                  >
                    <option value="">Select Zone 1</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <select
                    value={prevuData[index].zone2}
                    onChange={(e) =>
                      handleChange("prevu", index, "zone2", e.target.value)
                    }
                  >
                    <option value="">Select Zone 2</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <h2>Couv Réalisé</h2>
        <table className="table-input">
          <thead>
            <tr>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((_, index) => (
                <td key={index}>
                  <select
                    value={realiseData[index].zone1}
                    onChange={(e) =>
                      handleChange("realise", index, "zone1", e.target.value)
                    }
                  >
                    <option value="">Select Zone 1</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <select
                    value={realiseData[index].zone2}
                    onChange={(e) =>
                      handleChange("realise", index, "zone2", e.target.value)
                    }
                  >
                    <option value="">Select Zone 2</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <button onClick={handleSubmit} className="save-button">
          Submit Data
        </button>
      </div>
    </div>
  );
}

export default FormPage;
