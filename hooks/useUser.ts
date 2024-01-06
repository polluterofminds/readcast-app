import { UserStateContext } from '../contexts/UserContext';
import React, { useContext } from 'react'

export const useUser = () => {
  const context = useContext<any>(UserStateContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};