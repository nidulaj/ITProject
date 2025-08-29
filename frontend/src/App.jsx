import ProductCatalog from './features/order-management/pages/ProductCatalog'
import ThemeProvider from './contexts/ThemeContext'
import NotificationProvider from './contexts/NotificationContext'
import DarkModeToggle from './components/DarkModeToggle'
import NotificationContainer from './components/NotificationContainer'

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="relative">
          <NotificationContainer />
          <DarkModeToggle />
          <ProductCatalog />
        </div>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
