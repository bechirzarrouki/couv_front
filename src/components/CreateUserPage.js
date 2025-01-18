import React, { useState } from 'react';

function CreateUserPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('User created successfully!');
      } else {
        setMessage(data.message || 'Error creating user.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="create-user-container">
      <div className="create-user-card">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit} className="create-user-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="admin">Admin</option>
            <option value="Zone1">Zone1</option>
            <option value="Zone2">Zone2</option>
            <option value="Zone3">Zone3</option>
          </select>
          <button type="submit" className="create-user-button">Create User</button>
        </form>
        {message && <p className="create-user-message">{message}</p>}
      </div>
    </div>
  );
}

export default CreateUserPage;
