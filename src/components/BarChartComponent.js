import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChartPage = ({ zoness }) => {
  const [zone, setZone] = useState('');
  const [weeks, setWeeks] = useState(1);
  const [barChartData, setBarChartData] = useState(null);
  const [zones, setZones] = useState([]);
  const [totalCoverageReal, setTotalCoverageReal] = useState(0);
  const [totalCoveragePredicted, setTotalCoveragePredicted] = useState(0);
  const [totalCoverageSupp, setTotalCoverageSupp] = useState(0);
  const [highestCoverageWeek, setHighestCoverageWeek] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch session data to populate available zones
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/${zoness}/sessions/latest`)
      .then((response) => {
        const session = response.data;
        if (session && session.entries.length > 0) {
          const availableZones = session.entries.map((entry) => entry.zone);
          setZones(availableZones);
          setZone(availableZones[0]); // default selection
        }
      })
      .catch((error) => {
        console.error('Error fetching session data:', error);
      });
  }, []);

  // Automatically fetch the bar chart data on initial load once the default zone is set.
  useEffect(() => {
    if (zone && isInitialLoad) {
      fetchBarChartData();
      setIsInitialLoad(false);
    }
  }, [zone, isInitialLoad]);

  const fetchBarChartData = () => {
    if (zone && weeks) {
      axios
        .get(`http://localhost:5000/api/${zoness}/entries`, {
          params: { zone, weeks },
        })
        .then((response) => {
          const differences = response.data;
          if (differences.length > 0) {
            // Update bar chart data to include the supp value
            setBarChartData({
              labels: differences.map((diff) => `Week ${diff.week}`),
              datasets: [
                {
                  label: 'CouvPrev',
                  data: differences.map((diff) => diff.diffCouvPrev),
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
                {
                  label: 'CouvReal',
                  data: differences.map((diff) => diff.diffCouvReal),
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                },
                {
                  label: 'CouvSupp',
                  data: differences.map((diff) => diff.diffCouvSupp),
                  backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
              ],
            });

            // Calculate summary values
            const totalReal = differences.reduce(
              (acc, diff) => acc + diff.diffCouvReal,
              0
            );
            const totalPredicted = differences.reduce(
              (acc, diff) => acc + diff.diffCouvPrev,
              0
            );
            const totalSupp = differences.reduce(
              (acc, diff) => acc + diff.diffCouvSupp,
              0
            );
            setTotalCoverageReal(totalReal);
            setTotalCoveragePredicted(totalPredicted);
            setTotalCoverageSupp(totalSupp);

            // Determine the week with the highest real coverage
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

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bar Chart Page</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          Select Zone:
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.4rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <label style={{ marginRight: '1rem' }}>
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
      {barChartData && (
        <>
          {/* Summary Boxes */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
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
              <p style={{ fontSize: '1.2rem', color: '#007bff' }}>
                {totalCoverageReal}
              </p>
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
              <h4>Total Coverage Supp:</h4>
              <p style={{ fontSize: '1.2rem', color: '#9c27b0' }}>
                {totalCoverageSupp}
              </p>
            </div>
            <div
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#ffe0b2',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <h4>Week with Highest Coverage:</h4>
              <p style={{ fontSize: '1.2rem', color: '#ffb300' }}>
                {highestCoverageWeek}
              </p>
            </div>
          </div>
          {/* Bar Chart */}
          <div style={{ height: '300px' }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value' },
                  },
                  x: { title: { display: true, text: 'Weeks' } },
                },
                plugins: {
                  legend: { position: 'top' },
                  title: {
                    display: true,
                    text: `Weekly Differences for ${zone} (Last ${weeks} Weeks)`,
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BarChartPage;
