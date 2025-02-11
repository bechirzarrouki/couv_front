import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieCharts from '../components/PieCharts';
import BarChartComponent from '../components/BarChartComponent';
import LineChartComponent from '../components/LineChartComponent';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [latestSession, setLatestSession] = useState(null);
  const [zone, setZone] = useState('');
  const [weeks, setWeeks] = useState(1); // Retrieve role from localStorage

  useEffect(() => {
    const fetchLatestSession = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/zone3/sessions/latest`);
        console.log(response.data);
        setLatestSession(response.data);
        if (response.data && response.data.entries.length > 0) {
          setZone(response.data.entries[0].zone);
        }
      } catch (error) {
        console.error('Error fetching the latest session data:', error);
      }
    };
    
    fetchLatestSession();
  },[]);

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

        <BarChartComponent zone={zone} weeks={weeks} zoness={'zone3'} />
        <LineChartComponent zones={'zone3'} />
        <PieCharts latestSession={latestSession} />
      </div>
    </div>
  );
};

export default Dashboard;
