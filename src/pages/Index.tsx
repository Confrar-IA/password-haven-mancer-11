
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordVault from '../components/PasswordVault';

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PasswordVault initialUser={currentUser} />
    </div>
  );
};

export default Index;
