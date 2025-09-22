import { useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import RecipePage from "./features/production-management/pages/RecipePage";
import RequestIngredientsPage from "./features/production-management/pages/RequestIngredientsPage";
import Dashboard from "./features/production-management/pages/Dashboard";
import ReturnsCustomer from "./features/production-management/pages/ReturnsCustomer";
import CustomizedOrderPage from "./features/production-management/pages/CustomizedOrderPage";
import YogurtLandingPage from "./features/production-management/pages/YogurtLandingPage";

function App() {

  return (
    <>
      {/* <ReturnsCustomer/>
      <CustomizedOrderPage/> */}
      <Dashboard/>
      <YogurtLandingPage/>
    </>
  )
}

export default App

