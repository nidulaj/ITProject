import { useState, useEffect } from 'react'
import ProductCatalog from './ProductCatalog'
import CustomerCatalog from './CustomerCatalog'
import OrderManagementDashboard from './OrderManagementDashboard'
import ThemeProvider from '../../../contexts/ThemeContext'
import NotificationProvider from '../../../contexts/NotificationContext'
import CustomerProvider from '../../../contexts/CustomerContext'

const OrderDashboard = () => {
  const [currentView, setCurrentView] = useState('customer')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/admin') setCurrentView('admin')
    else if (path === '/orders') setCurrentView('orders')
    else setCurrentView('customer')
  }, [])

  useEffect(() => {
    const handleNavigation = (event) => {
      if (event.detail?.view) setCurrentView(event.detail.view)
    }
    window.addEventListener('navigate', handleNavigation)
    return () => window.removeEventListener('navigate', handleNavigation)
  }, [])

  const NavigationButtons = ({ buttons }) => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {buttons.map(({ label, onClick, className = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200" }) => (
        <button key={label} onClick={onClick} className={className}>
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <ThemeProvider>
      <CustomerProvider>
        <NotificationProvider>
          <div className="relative">
          {currentView === 'admin' && (
            <>
              <NavigationButtons buttons={[
                { label: '📋 Orders', onClick: () => setCurrentView('orders') },
                { label: '🛍️ Customer Shop', onClick: () => setCurrentView('customer') }
              ]} />
              <ProductCatalog />
            </>
          )}
          
          {currentView === 'orders' && (
            <>
              <NavigationButtons buttons={[
                { label: '⚙️ Admin Panel', onClick: () => setCurrentView('admin') },
                { label: '🛍️ Customer Shop', onClick: () => setCurrentView('customer') }
              ]} />
              <OrderManagementDashboard />
            </>
          )}
          
          {currentView === 'customer' && (
            <>
              <NavigationButtons buttons={[
                { label: '📋 Orders', onClick: () => setCurrentView('orders') },
                { label: '⚙️ Admin Panel', onClick: () => setCurrentView('admin') }
              ]} />
              <CustomerCatalog />
            </>
          )}
          
          </div>
        </NotificationProvider>
      </CustomerProvider>
    </ThemeProvider>
  )
}

export default OrderDashboard
