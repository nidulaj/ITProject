import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "./components/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import ProtectedRoute from "./components/ProtectedRoute"


const Register = lazy(() => import("./features/user-management/pages/Register"))
const Login = lazy(() => import("./features/user-management/pages/Login"))
const Verify2FA = lazy(() => import("./features/user-management/pages/Verify2FA"))
const CustomerDashboard = lazy(() => import("./pages/Dashboard"))
const CustomerCatalog = lazy(() => import("./features/order-management/pages/CustomerCatalogWrapper"))
const VerifyEmail = lazy(() => import("./features/user-management/pages/VerifyEmail"))
const AdminDashboard = lazy(() => import("./features/user-management/pages/AdminDashboard"))
const ProductionDashboard = lazy(() => import("./features/production-management/pages/Dashboard"))
const OrderDashboard = lazy(() => import ("./features/order-management/pages/OrderDashboard"))
const InventryDashboard = lazy(() => import ("./features/inventory-management/pages/Dashboard")) 
const FinanceDashboard = lazy(() => import ("./features/financial-management/pages/FinanceDashboard"))
const PaymentFormPage = lazy(() => import("./features/financial-management/pages/PaymentFormPage"))
const ResetPassword = lazy(() => import ("./features/user-management/pages/ResetPassword"))
const CustomerDiscountPage = lazy(() => import("./features/financial-management/pages/CustomerDiscountPage"));
const SupportWidget = lazy(() => import("./features/user-management/components/SupportWidget"));


const YogurtLandingPage = lazy(() => import ("./features/production-management/pages/YogurtLandingPage")) //Rashmika
const IngReqAccTable = lazy(() => import ("./features/production-management/components/IngReqAccTable")) //Rahmika
const PubuduHomepage = lazy(() => import ("./features/production-management/pages/PubuduHomePage")) //Rashmika
const ResetPasswordStaff = lazy(() => import ("./features/user-management/pages/ResetPasswordStaff"))

const DashboardLayout = ({ children }) => <div>{children}</div>;

// App content component handles route-based logic for SupportWidget
function AppContent() {
  const location = useLocation();


  const hideSupportWidget = location.pathname.startsWith("/dashboard/admin");




  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify2FA" element={<Verify2FA />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-staff" element={<ResetPasswordStaff />} />
        <Route path="/YogurtLandingPage" element={<YogurtLandingPage />} />

        {/* Customer dashboards */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/production"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductionDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/order/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrderDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/inventory"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InventryDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
                path="/dashboard/finance/payment-form"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentFormPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />


        <Route
          path="/dashboard/finance/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FinanceDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Customer-facing discount view */}
        <Route path="/customer-discounts" element={<CustomerDiscountPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Show SupportWidget everywhere except admin dashboard */}
      {!hideSupportWidget && <SupportWidget />}
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <AppContent />
          </Suspense>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
