'use client';

import { useState, useEffect } from 'react';

interface LoginService {
  isLoggedIn: boolean;
  userId: number | null;
  handleLoginLogout: () => void;
  checkLoginStatus: () => void;
}

export const useLoginService = (): LoginService => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const checkLoginStatus = () => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(user.isLoggedIn);
        setUserId(user.userId || null);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        setIsLoggedIn(false);
        setUserId(null);
        sessionStorage.removeItem('user'); // Clear corrupted data
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // Clear session storage on logout
      sessionStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserId(null);
    } else {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.userId || null);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          setUserId(null);
        }
      }
      setIsLoggedIn(true);
    }
  };

  return {
    isLoggedIn,
    userId,
    handleLoginLogout,
    checkLoginStatus
  };
};
