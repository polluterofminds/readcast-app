import { LibraryStateContext } from 'contexts/LibraryContext';
import React, { useContext } from 'react'

export const useLibrary = () => {
  const context = useContext<any>(LibraryStateContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};