import './App.css'
import { useState } from 'react'
import ProductCatalog from './features/order-management/pages/ProductCatalog'
import CustomerCatalog from './features/order-management/pages/CustomerCatalog'
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
              <button 
                onClick={() => setCurrentView('customer')}
                className="fixed bottom-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                🛍️ Customer Shop
              </button>
              <ProductCatalog />
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setCurrentView('admin')}
                className="fixed bottom-4 right-4 z-50 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                ⚙️ Admin Panel
              </button>
              <CustomerCatalog />
            </div>
          )}
        </div>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
