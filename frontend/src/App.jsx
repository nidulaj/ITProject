import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "./components/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import ProtectedRoute from "./components/ProtectedRoute"
import CustomerDiscountPage from "./features/financial-management/pages/CustomerDiscountPage";


const Register = lazy(() => import("./features/user-management/pages/Register"))
const Login = lazy(() => import("./features/user-management/pages/Login"))
const Verify2FA = lazy(() => import("./features/user-management/pages/Verify2FA"))
const CustomerDashboard = lazy(() => import("./features/user-management/pages/Dashboard"))
const CustomerCatalog = lazy(() => import("./features/order-management/pages/CustomerCatalogWrapper"))
const VerifyEmail = lazy(() => import("./features/user-management/pages/VerifyEmail"))
const AdminDashboard = lazy(() => import("./features/user-management/pages/AdminDashboard"))
const ProductionDashboard = lazy(() => import("./features/production-management/pages/Dashboard"))
const OrderDashboard = lazy(() => import ("./features/order-management/pages/OrderDashboard"))
const ProductCatalog = lazy(() => import ("./features/order-management/pages/ProductCatalogFixed"))
const InventryDashboard = lazy(() => import ("./features/inventory-management/pages/Dashboard")) 
const FinanceDashboard = lazy(() => import ("./features/financial-management/pages/FinanceDashboard"))


const YogurtLandingPage = lazy(() => import ("./features/production-management/pages/YogurtLandingPage"))


const DashboardLayout = ({ children }) => <div>{children}</div>

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify2FA" element={<Verify2FA />} />
              <Route path="/verifyEmail" element={<VerifyEmail />} />

              <Route path="/YogurtLandingPage" element={<YogurtLandingPage />} />
              

              {/* User Dashboards */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerCatalog />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

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
                path="/dashboard/order"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <OrderDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/products"
                element={
                  <ProtectedRoute>
                    <NotificationProvider>
                      <DashboardLayout>
                        <ProductCatalog />
                      </DashboardLayout>
                    </NotificationProvider>
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

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
              {/* Customer-facing discount view (independent route) */}
        <Route path="/customer-discounts" element={<CustomerDiscountPage />} />
        

            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App;



