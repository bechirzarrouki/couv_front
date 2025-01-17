import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const FormPage = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/entries', formData);
      alert('Data saved successfully!');
      setFormData({ field1: '', field2: '', field3: '', field4: '' });
    } catch (error) {
      console.error(error);
      alert('Error saving data!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit Form</h1>
      <input name="field1" value={formData.field1} onChange={handleChange} placeholder="Field 1" required />
      <input name="field2" value={formData.field2} onChange={handleChange} placeholder="Field 2" required />
      <input name="field3" value={formData.field3} onChange={handleChange} placeholder="Field 3" required />
      <input name="field4" value={formData.field4} onChange={handleChange} placeholder="Field 4" required />
      <button type="submit">Save</button>
    </form>
  );
};

export default FormPage;
