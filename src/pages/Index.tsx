
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordVault from '../components/PasswordVault';
import { User } from '../components/PasswordVault';

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    console.log("Index page - checking stored user:", storedUser);
    
    if (!storedUser) {
      console.log("No user found, redirecting to login");
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("User found:", parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
  }, [navigate]);

  // If loading, show nothing yet
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // If no user and not loading, we should be redirected to login
  if (!currentUser && !loading) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PasswordVault initialUser={currentUser} />
    </div>
  );
};

export default Index;
