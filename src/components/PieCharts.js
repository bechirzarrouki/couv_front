import { Pie } from 'react-chartjs-2';
import React from 'react';
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

const PieChart = ({ latestSession }) => {
  // Debug log to verify that data is passed
  console.log("PieChart received latestSession:", latestSession);

  // If no data is available, show a fallback message
  if (!latestSession || !latestSession.entries || latestSession.entries.length === 0) {
    return <div style={{ padding: '2rem' }}>No pie chart data available.</div>;
  }

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

  // Build chart data objects for each type
  const pieChartDataReal = {
    labels: latestSession.entries.map((entry) => entry.zone),
    datasets: [
      {
        label: 'Coverage Comparison Real',
        data: latestSession.entries.map((entry) => entry.percentageCouvReal),
        backgroundColor: generateColors(latestSession.entries.length),
      },
    ],
  };

  const pieChartDataPrev = {
    labels: latestSession.entries.map((entry) => entry.zone),
    datasets: [
      {
        label: 'Coverage Comparison Predicted',
        data: latestSession.entries.map((entry) => entry.percentageCouvPrev),
        backgroundColor: generateColors(latestSession.entries.length),
      },
    ],
  };

  const pieChartDataSupp = {
    labels: latestSession.entries.map((entry) => entry.zone),
    datasets: [
      {
        label: 'Coverage Comparison Supplémentaire',
        data: latestSession.entries.map((entry) => entry.percentageCouvSupp),
        backgroundColor: generateColors(latestSession.entries.length),
      },
    ],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '2%',
        }}
      >
        {/* Pie Chart for Real Coverage */}
        <div
          style={{
            flex: '1 1 48%',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem',
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

        {/* Pie Chart for Predicted Coverage */}
        <div
          style={{
            flex: '1 1 48%',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem',
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

        {/* Pie Chart for Supplémentaire Coverage */}
        <div
          style={{
            flex: '1 1 48%',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem',
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
            Coverage Distribution (Supplémentaire)
          </h2>
          <div style={{ height: '300px' }}>
            <Pie
              data={pieChartDataSupp}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Coverage Distribution (Supplémentaire)' },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
