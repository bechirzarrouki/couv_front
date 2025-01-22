import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from '../components/PieCharts';
import Navbar from '../components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [latestSession, setLatestSession] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [zone, setZone] = useState('');
  const [weeks, setWeeks] = useState(1);

  // State for the summary boxes
  const [totalCoverageReal, setTotalCoverageReal] = useState(0);
  const [totalCoveragePredicted, setTotalCoveragePredicted] = useState(0);
  const [highestCoverageWeek, setHighestCoverageWeek] = useState('');

  useEffect(() => {
    // Fetch the latest session data
    axios
      .get('http://localhost:5000/api/zone2/sessions/latest')
      .then((response) => {
        setLatestSession(response.data);
        if (response.data && response.data.entries.length > 0) {
          setZone(response.data.entries[0].zone); // Default zone
        }
      })
      .catch((error) => {
        console.error('Error fetching the latest session data:', error);
      });
  }, []); // This effect runs once when the component mounts

  const fetchBarChartData = () => {
    // Fetch data for the bar chart based on the selected zone and weeks
    if (zone && weeks) {
      axios
        .get('http://localhost:5000/api/zone2/entries', {
          params: { zone, weeks },
        })
        .then((response) => {
          const differences = response.data; // Assuming API returns differences array

          if (differences.length > 0) {
            // Update bar chart data
            setBarChartData({
              labels: differences.map((diff) => `Week ${diff.week}`),
              datasets: [
                {
                  label: 'CouvPrev',
                  data: differences.map((diff) => diff.diffCouvPrev),
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'CouvReal',
                  data: differences.map((diff) => diff.diffCouvReal),
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
                {
                  label: '%CouvPrev',
                  data: differences.map((diff) => diff.diffPercentageCouvPrev),
                  backgroundColor: 'rgba(255, 206, 86, 0.6)',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                },
                {
                  label: '%CouvReal',
                  data: differences.map((diff) => diff.diffPercentageCouvReal),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            });

            // Calculate and set values for the summary boxes
            const totalReal = differences.reduce(
              (acc, diff) => acc + diff.diffCouvReal,
              0
            );
            const totalPredicted = differences.reduce(
              (acc, diff) => acc + diff.diffCouvPrev,
              0
            );
            setTotalCoverageReal(totalReal);
            setTotalCoveragePredicted(totalPredicted);

            // Find the week with the highest coverage
            const highestDiffWeek = differences.reduce(
              (max, diff) =>
                Math.abs(diff.diffCouvReal) > Math.abs(max.diffCouvReal)
                  ? diff
                  : max,
              differences[0]
            );
            setHighestCoverageWeek(highestDiffWeek.week);
          }
        })
        .catch((error) => {
          console.error('Error fetching bar chart data:', error);
        });
    }
  };

  const lineChartData = latestSession
    ? {
        labels: latestSession.entries.map((entry) => entry.zone),
        datasets: [
          {
            label: 'Taux de couverture prévu (%)',
            data: latestSession.entries.map((entry) => entry.percentageCouvPrev),
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Taux de couverture réalisée (%)',
            data: latestSession.entries.map((entry) => entry.percentageCouvReal),
            borderColor: 'red',
            fill: false,
          },
        ],
      }
    : null;

  return (
    <div>
      <Navbar />
      <div
        style={{
          width: '80%',
          margin: 'auto',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '1.8rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: '#333',
            fontWeight: 'bold',
          }}
        >
          Dashboard
        </h1>

        {/* Input Fields for Zone and Weeks */}
        <div
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #ddd',
          }}
        >
          <label style={{ marginRight: '1rem', fontSize: '1rem', color: '#555' }}>
            Select Zone:
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                outline: 'none',
              }}
            >
              {latestSession &&
                latestSession.entries.map((entry) => (
                  <option key={entry.zone} value={entry.zone}>
                    {entry.zone}
                  </option>
                ))}
            </select>
          </label>

          <label style={{ marginRight: '1rem', fontSize: '1rem', color: '#555' }}>
            Weeks:
            <input
              type="number"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem',
                width: '4rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                outline: 'none',
              }}
            />
          </label>

          <button
            onClick={fetchBarChartData}
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
            Show Bar Chart
          </button>
        </div>

        {/* Summary Boxes */}
        {barChartData && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#e0f7fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <h4>Total Coverage Real:</h4>
              <p style={{ fontSize: '1.2rem', color: '#007bff' }}>{totalCoverageReal}</p>
            </div>
            <div
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <h4>Total Coverage Predicted:</h4>
              <p style={{ fontSize: '1.2rem', color: '#43a047' }}>
                {totalCoveragePredicted}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#fffde7',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <h4>Week with Highest Coverage:</h4>
              <p style={{ fontSize: '1.2rem', color: '#ffb300' }}>{highestCoverageWeek}</p>
            </div>
          </div>
        )}
        {/* Bar Chart */}
        {barChartData && (
          <div
            style={{
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '1.4rem',
                textAlign: 'center',
                marginBottom: '1rem',
                color: '#333',
              }}
            >
              Bar Chart
            </h2>
            <div style={{ height: '300px' }}>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: `Weekly Differences for ${zone} (Last ${weeks} Weeks)`,
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Value' } },
                    x: { title: { display: true, text: 'Weeks' } },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Line Chart */}
        {lineChartData && (
          <div
            style={{
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '1.4rem',
                textAlign: 'center',
                marginBottom: '1rem',
                color: '#333',
              }}
            >
              Line Chart
            </h2>
            <div style={{ height: '300px' }}>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Coverage Rates (%)',
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Coverage (%)' } },
                    x: { title: { display: true, text: 'Zones' } },
                  },
                }}
              />
            </div>
          </div>
        )}

        <PieChart latestSession={latestSession} />
      </div>
    </div>
  );
};

export default Dashboard;
