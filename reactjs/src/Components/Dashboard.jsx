import React, { useEffect, useState } from 'react';
import "../App.css";
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('User data from API:', response.data.user);  // <-- debug line
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        alert('Session expired! Please login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {user ? (
        <>
          <h2>Welcome {user.name || user.email}</h2>
          <p>You are successfully logged in with JWT token</p>
          <button onClick={() => {
            
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>Logout</button>
        </>
      ) : (
        <p>Loading user data..........</p>
      )}
    </div>
  );
}

export default Dashboard;
