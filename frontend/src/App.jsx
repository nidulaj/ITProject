import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

const Register = lazy(() => import("./features/user-management/pages/Register"))
const Login = lazy(() => import("./features/user-management/pages/Login"))
const Verify2FA = lazy(() => import("./features/user-management/pages/Verify2FA"))

function App() {

  return (
    <>
      <Verify2FA />
    </>
  )
}

export default App
