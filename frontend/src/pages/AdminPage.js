import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { auth } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      await axios.post('/api/users/add-staff', { name, email, password }, config);
      setMessage('Staff user created successfully!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err.response.data.msg || 'Error creating user');
    }
  };

  return (
    <div>
      <h2>Admin Page - Add Staff User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Add User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPage;
