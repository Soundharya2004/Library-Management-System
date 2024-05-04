import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from '../app/studentdashboard';
import baseURL from '../auth/connection'; // Import baseURL from connection file
import ProfileSetup from './ProfileSetup';

const DashboardWrapper = () => {
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    // Check if user setup is complete
    axios.get(`${baseURL}/api/checkUser`)
      .then(response => {
        setSetupComplete(response.data.setupComplete);
      })
      .catch(error => { 
        console.error('Error checking user setup:', error);
      });
  }, []);

  return (
    <>
      {setupComplete ? <StudentDashboard /> : <ProfileSetup />}
    </>
  );
};

export default DashboardWrapper;
