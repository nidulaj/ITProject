import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FinanceDashboard from "./features/financial-management/pages/FinanceDashboard";
import DiscountPage from "./features/financial-management/pages/DiscountPage";
import PaymentPage from "./features/financial-management/pages/PaymentPage";
import PaymentFormPage from "./features/financial-management/pages/PaymentFormPage";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<FinanceDashboard />} />

        
        <Route path="/discounts" element={<DiscountPage />} />

      
        <Route path="/payments" element={<PaymentPage />} />

      
        <Route path="/payment-form" element={<PaymentFormPage />} />



      </Routes>
    </Router>
  );
}

export default App;


