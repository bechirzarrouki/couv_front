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

  return (
    <div>
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
};

export default PieChart;
