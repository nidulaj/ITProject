import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

const Register = lazy(() => import("./features/user-management/pages/Register"))
const Login = lazy(() => import("./features/user-management/pages/Login"))
const Verify2FA = lazy(() => import("./features/user-management/pages/Verify2FA"))
const Dashboard = lazy(() => import("./features/user-management/pages/Dashboard"))
const VerifyEmail = lazy(() => import("./features/user-management/pages/VerifyEmail"))

const DashboardLayout = ({children}) => <div>{children}</div>
function App() {

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify2FA" element={<Verify2FA />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />

            {/* Protected routes with nested layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
