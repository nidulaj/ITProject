/*import React from "react";
import PaymentForm from "../components/PaymentForm";

const PaymentFormPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <PaymentForm />
    </div>
  );
};

export default PaymentFormPage;*/



import React from "react";
import PaymentForm from "../components/PaymentForm";

const PaymentFormPage = ({ onUpdateStats }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <PaymentForm onUpdateStats={onUpdateStats} />
    </div>
  );
};

export default PaymentFormPage;
