import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const DisplayPage = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/entries');
        setEntries(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEntries();
  }, []);

  return (
    <div className="entries">
      <h1>Entries</h1>
      {entries.map((entry) => (
        <div className="entry" key={entry._id}>
          <p>Field 1: {entry.field1}</p>
          <p>Field 2: {entry.field2}</p>
          <p>Field 3: {entry.field3}</p>
          <p>Field 4: {entry.field4}</p>
          <p>Created At: {new Date(entry.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayPage;
