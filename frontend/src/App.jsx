import './App.css'
import { useState } from 'react'
import ProductCatalog from './features/order-management/pages/ProductCatalog'
import CustomerCatalog from './features/order-management/pages/CustomerCatalog'
import OrderManagement from './features/order-management/pages/OrderManagement'
import ThemeProvider from './contexts/ThemeContext'
import NotificationProvider from './contexts/NotificationContext'
import NotificationContainer from './components/NotificationContainer'

function App() {
  const [currentView, setCurrentView] = useState('customer'); // Start with customer catalog

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
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
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
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
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
              <OrderManagement />
            </div>
          ) : (
            <div>
              <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <button 
                  onClick={() => setCurrentView('orders')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  📋 Orders
                </button>
                <button 
                  onClick={() => setCurrentView('admin')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
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
