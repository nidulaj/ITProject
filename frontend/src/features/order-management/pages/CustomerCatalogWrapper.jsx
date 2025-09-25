import CustomerCatalog from './CustomerCatalog';
import DashboardHeader from '../../user-management/components/DashboardHeader';
import ThemeProvider from '../../../contexts/ThemeContext';
import NotificationProvider from '../../../contexts/NotificationContext';
import CustomerProvider from '../../../contexts/CustomerContext';

const CustomerCatalogWrapper = () => {
  return (
    <ThemeProvider>
      <CustomerProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            <DashboardHeader />
            <CustomerCatalog />
          </div>
        </NotificationProvider>
      </CustomerProvider>
    </ThemeProvider>
  );
};

export default CustomerCatalogWrapper;
