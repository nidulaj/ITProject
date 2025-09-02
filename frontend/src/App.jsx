import './App.css'
import { useState, useEffect } from 'react'
import ProductCatalog from './features/order-management/pages/ProductCatalog'
import CustomerCatalog from './features/order-management/pages/CustomerCatalog'
import OrderManagementDashboard from './features/order-management/pages/OrderManagementDashboard'

import ThemeProvider from './contexts/ThemeContext'
import NotificationProvider from './contexts/NotificationContext'
import NotificationContainer from './components/NotificationContainer'

function App() {
  const [currentView, setCurrentView] = useState('customer'); // Start with customer catalog

  // Listen for navigation events from components
  useEffect(() => {
    const handleNavigation = (event) => {
      if (event.detail && event.detail.view) {
        setCurrentView(event.detail.view);
      }
    };

    window.addEventListener('navigate', handleNavigation);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation);
    };
  }, []);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="relative">
          <NotificationContainer />
          {currentView === 'admin' ? (
            <div>
              <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <button 
                  onClick={() => setCurrentView('orders')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  📋 Orders
                </button>
                <button 
                  onClick={() => setCurrentView('customer')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  🛍️ Customer Shop
                </button>
              </div>
              <ProductCatalog />
            </div>
          ) : currentView === 'orders' ? (
            <div>
              <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <button 
                  onClick={() => setCurrentView('admin')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  ⚙️ Admin Panel
                </button>
                <button 
                  onClick={() => setCurrentView('customer')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  🛍️ Customer Shop
                </button>
              </div>
              <OrderManagementDashboard />
            </div>

          ) : (
            <div>
              <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <button 

                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  📋 Orders
                </button>
                <button 
                  onClick={() => setCurrentView('admin')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  ⚙️ Admin Panel
                </button>
              </div>
              <CustomerCatalog />
            </div>
          )}
        </div>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App