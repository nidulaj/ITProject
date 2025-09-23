import { createContext, useContext, useEffect, useState } from 'react';

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    // Get customer from localStorage or default to 1
    const saved = localStorage.getItem('currentCustomer');
    if (saved) {
      return JSON.parse(saved);
    }
    return { id: 1, name: 'Default Customer' };
  });

  useEffect(() => {
    // Save customer to localStorage
    localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
  }, [currentCustomer]);

  const setCustomer = (customer) => {
    setCurrentCustomer(customer);
  };

  const logout = () => {
    setCurrentCustomer(null);
    localStorage.removeItem('currentCustomer');
  };

  const value = {
    currentCustomer,
    setCustomer,
    logout,
    isLoggedIn: !!currentCustomer
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
