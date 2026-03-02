import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// Custom hook for components to access cart state
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
