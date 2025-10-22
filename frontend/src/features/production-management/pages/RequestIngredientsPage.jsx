// import React from "react";
import RequestIngredientsForm from "../components/RequestIngredientsForm";

function RequestIngredientsPage({ recipeNo, onBack }) {
  return (
    <div>
      <h2>Request Ingredients Page</h2>
      <RequestIngredientsForm recipeNo={recipeNo} onCancel={onBack} />
    </div>
  );
}

export default RequestIngredientsPage;

