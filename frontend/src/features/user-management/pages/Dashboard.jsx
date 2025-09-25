import DashboardHeader from "../components/DashboardHeader";
import CustomerCatalog from "../../order-management/pages/CustomerCatalog";
import ThemeProvider from "../../../contexts/ThemeContext";
import NotificationProvider from "../../../contexts/NotificationContext";
import CustomerProvider from "../../../contexts/CustomerContext";

export default function Dashboard() {
  return <DashboardHeader />;
}