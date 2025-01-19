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

  // State for the summary boxes
  const [totalCoverageReal, setTotalCoverageReal] = useState(0);
  const [totalCoveragePredicted, setTotalCoveragePredicted] = useState(0);
  const [highestCoverageWeek, setHighestCoverageWeek] = useState('');

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
            const totalReal = differences.reduce((acc, diff) => acc + diff.diffCouvReal, 0);
            const totalPredicted = differences.reduce((acc, diff) => acc + diff.diffCouvPrev, 0);
            setTotalCoverageReal(totalReal);
            setTotalCoveragePredicted(totalPredicted);

            // Find the week with the highest coverage
            const highestDiffWeek = differences.reduce((max, diff) => 
              Math.abs(diff.diffCouvReal) > Math.abs(max.diffCouvReal) ? diff : max, differences[0]);
            setHighestCoverageWeek(highestDiffWeek.week);

          }
        })
        .catch((error) => {
          console.error('Error fetching bar chart data:', error);
        });
    }
  }, [weeks, zone]); // Dependencies include both zone and weeks

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

  const pieChartDataReal = latestSession
    ? {
        labels: latestSession.entries.map((entry) => entry.zone),
        datasets: [
          {
            label: 'Coverage Comparison Real',
            data: latestSession.entries.map((entry) => entry.percentageCouvReal),
            backgroundColor: generateColors(latestSession.entries.length),
          },
        ],
      }
    : null;

  const pieChartDataPrev = latestSession
    ? {
        labels: latestSession.entries.map((entry) => entry.zone),
        datasets: [
          {
            label: 'Coverage Comparison Predicted',
            data: latestSession.entries.map((entry) => entry.percentageCouvPrev),
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
    
        {/* Dropdown for Zone and Weeks */}
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
    
          <label style={{ fontSize: '1rem', color: '#555' }}>
            Weeks:
            <input
              type="number"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              min="1"
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
        </div>
    
        {/* Summary Boxes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '2rem',
          }}
        >
          {[
            { title: 'Total Coverage (Real)', value: totalCoverageReal },
            { title: 'Total Coverage (Predicted)', value: totalCoveragePredicted },
            { title: 'Week with Highest Coverage', value: highestCoverageWeek },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                width: '23%',
                textAlign: 'center',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '1.2rem', color: '#333' }}>{item.value}</p>
            </div>
          ))}
        </div>
    
        {/* Bar Chart */}
        {barChartData && (
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2
              style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', color: '#333' }}
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
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2
              style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', color: '#333' }}
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
                    title: { display: true, text: 'Coverage Trends' },
                  },
                }}
              />
            </div>
          </div>
        )}
    
        {/* Pie Charts */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2%' }}>
          {/* Pie Chart for Real Coverage */}
          {pieChartDataReal && (
            <div
              style={{
                width: '48%',
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', color: '#333' }}
              >
                Coverage Distribution (Real)
              </h2>
              <div style={{ height: '300px' }}>
                <Pie
                  data={pieChartDataReal}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Coverage Distribution (Real)' },
                    },
                  }}
                />
              </div>
            </div>
          )}
    
          {/* Pie Chart for Predicted Coverage */}
          {pieChartDataPrev && (
            <div
              style={{
                width: '48%',
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', color: '#333' }}
              >
                Coverage Distribution (Predicted)
              </h2>
              <div style={{ height: '300px' }}>
                <Pie
                  data={pieChartDataPrev}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Coverage Distribution (Predicted)' },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
    
  }
export default Dashboard;
  