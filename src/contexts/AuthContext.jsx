// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState(180); // 3 minutes in seconds
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();


  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // If no token, user is not authenticated
        if (!token) {
          setAuthenticated(false);
          setUser(null);
          setShowTimer(false);
          setLoading(false);
          return;
        }

        // Try to get current user from your API
        const response = await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/getme`, {
          credentials: 'include', // Important for cookies
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.data); // Set user data from the response
          setAuthenticated(true);
          setShowTimer(true); // Show timer when user is logged in
          startSessionTimer();
        } else {
          // If API request fails, clear user data
          setUser(null);
          setAuthenticated(false);
          setShowTimer(false);
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setUser(null);
        setAuthenticated(false);
        localStorage.removeItem('accessToken');

      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // rerun when authenticated sige changes

  const handleGithubLogin = (token) => {
    // Store token in localStorage
    localStorage.setItem('accessToken', token);
    // Force authentication check
    checkUserStatus();
  };

  const startSessionTimer = () => {
    // Reset session time to 3 minutes (180 seconds)
    setSessionTime(180);

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Start new timer that decrements the session time every second
    timerRef.current = setInterval(() => {
      setSessionTime(prevTime => {
        if (prevTime <= 1) {
          // Time's up, clear the timer and reload the page
          clearInterval(timerRef.current);
          logout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Reset the session timer (called on user activity)
  const resetSessionTimer = () => {
    if (authenticated) {
      startSessionTimer();
    }
  };

  // Format the time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  // logout function
  const logout = async () => {
    try {

      const token = localStorage.getItem('accessToken');

      // Optional: Make an API call to log out the user
      await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear user state and localStorage
      setUser(null);
      setAuthenticated(false);
      setShowTimer(false);
      localStorage.removeItem('accessToken');

      if (timerRef.current) clearInterval(timerRef.current);

      // Redirect to the welcome page
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem('accessToken');
      navigate('/welcome', { replace: true });

    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authenticated,
      setAuthenticated,
      logout,
      showTimer,
      sessionTimeFormatted: formatTime(sessionTime),
      resetSessionTimer,
      handleGithubLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);