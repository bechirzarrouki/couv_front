import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const LineChartPage = ({ zones }) => {
  // Store all sessions returned by the API
  const [sessions, setSessions] = useState([]);
  // The currently selected session (for a specific week)
  const [selectedSession, setSelectedSession] = useState(null);
  // The chosen session index (from the select value)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch all sessions from the API
  const fetchSessions = () => {
    axios
      .get(`http://localhost:5000/api/${zones}/sessions`)
      .then((response) => {
        const sessionsData = response.data;
        console.log(sessionsData);
        setSessions(sessionsData);
        if (sessionsData.length > 0) {
          // Set default selection to the first session
          setSelectedIndex(0);
          setSelectedSession(sessionsData[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching sessions data:', error);
      });
  };

  // Fetch sessions when the component mounts
  useEffect(() => {
    fetchSessions();
  }, []);

  // Update the selected session whenever the chosen index changes
  useEffect(() => {
    if (sessions.length > 0) {
      setSelectedSession(sessions[selectedIndex]);
    }
  }, [selectedIndex, sessions]);

  // Build the line chart data using the selected session's entries
  const lineChartData = selectedSession
    ? {
        labels: selectedSession.entries.map((entry) => entry.zone),
        datasets: [
          {
            label: 'Taux de couverture prévu (%)',
            data: selectedSession.entries.map(
              (entry) => entry.percentageCouvPrev
            ),
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Taux de couverture réalisée (%)',
            data: selectedSession.entries.map(
              (entry) => entry.percentageCouvReal
            ),
            borderColor: 'red',
            fill: false,
          },
          {
            label: 'Taux de couverture supplémentaire (%)',
            data: selectedSession.entries.map(
              (entry) => entry.percentageCouvSupp
            ),
            borderColor: 'green',
            fill: false,
          },
        ],
      }
    : null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Line Chart Page</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          Select Week:
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            style={{
              marginLeft: '0.5rem',
              padding: '0.4rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            {sessions.map((session, i) => (
              <option key={i} value={i}>
                Week {i}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={fetchSessions}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #007bff',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Refresh Sessions
        </button>
      </div>
      {lineChartData && (
        <div style={{ height: '300px' }}>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Coverage (%)' },
                },
                x: { title: { display: true, text: 'Zones' } },
              },
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Coverage Rates (%)' },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LineChartPage;
