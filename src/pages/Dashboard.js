import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { Line, Pie, Bar } from 'react-chartjs-2';

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

  useEffect(() => {
    // Fetch the latest session data
    axios
      .get('http://localhost:5000/api/coverage/sessions/latest')
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

  useEffect(() => {
    // Fetch data for the bar chart based on the selected zone and weeks
    if (zone && weeks) {
      console.log(`Fetching data for zone: ${zone} and weeks: ${weeks}`);
      axios
        .get('http://localhost:5000/api/coverage/entries', {
          params: { zone, weeks },
        })
        .then((response) => {
          console.log('API Response:', response.data);  // Log API response to debug
          const differences = response.data; // Assuming API returns differences array
          if (differences.length > 0) {
            setBarChartData({
              labels: differences.map((diff) => diff.week),
              datasets: [
                {
                  label: 'Diff CouvPrev',
                  data: differences.map((diff) => diff.diffCouvPrev),
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'Diff CouvReal',
                  data: differences.map((diff) => diff.diffCouvReal),
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'Diff %CouvPrev',
                  data: differences.map((diff) => diff.diffPercentageCouvPrev),
                  backgroundColor: 'rgba(255, 206, 86, 0.6)',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'Diff %CouvReal',
                  data: differences.map((diff) => diff.diffPercentageCouvReal),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching bar chart data:', error);
        });
    }
  }, [weeks,zone]); // Dependencies include both zone and weeks

  const predefinedColors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(199, 199, 199, 0.6)',
    'rgba(83, 102, 255, 0.6)',
    'rgba(255, 85, 128, 0.6)',
    'rgba(144, 238, 144, 0.6)',
    'rgba(30, 144, 255, 0.6)',
    'rgba(106, 90, 205, 0.6)',
    'rgba(200, 255, 0, 0.49)',
    'rgba(220, 20, 60, 0.6)',
  ];

  const generateColors = (count) => predefinedColors.slice(0, count);

  const pieChartData = latestSession
    ? {
        labels: latestSession.entries.map((entry) => entry.zone),
        datasets: [
          {
            label: 'Coverage Comparison',
            data: latestSession.entries.map((entry) => entry.percentageCouvReal),
            backgroundColor: generateColors(latestSession.entries.length),
          },
        ],
      }
    : null;

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
    <div style={{ width: '80%', margin: 'auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Dashboard</h1>

      {/* Dropdown for Zone and Weeks */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label style={{ marginRight: '1rem' }}>
          Select Zone:
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            {latestSession &&
              latestSession.entries.map((entry) => (
                <option key={entry.zone} value={entry.zone}>
                  {entry.zone}
                </option>
              ))}
          </select>
        </label>

        <label>
          Weeks:
          <input
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            min="1"
            style={{ marginLeft: '0.5rem', width: '4rem' }}
          />
        </label>
      </div>

      {/* Bar Chart */}
      {barChartData && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Bar Chart</h2>
          <div style={{ height: '300px' }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: `Weekly Differences for ${zone} (Last ${weeks} Weeks)` },
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
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Line Chart</h2>
          <div style={{ height: '300px' }}>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Coverage Trends' },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Pie Chart */}
      {pieChartData && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Pie Chart</h2>
          <div style={{ height: '300px' }}>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Coverage Distribution' },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
