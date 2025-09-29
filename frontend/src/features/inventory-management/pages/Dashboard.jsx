import React, { useState, useEffect } from "react";
import { authFetch } from "../../user-management/utils/authFetchStaff";
import IngredientForm from "../components/IngredientForm";
import SpecialIngredientForm from "../components/SpecialIngredientForm";
import FinalProductForm from "../components/FinalProductForm";
import ZoneForm from "../components/ZoneForm";
import profilePic from "../../../assets/profile.jpg";
import Header from "../components/Header";
import UserProfile from "../../user-management/components/UserProfile";
import IcodePage from "../components/IcodePage"; 
import Ing_req_acc_table from "../components/ing_req_acc_table";
import IngredientTotalsPage from "../components/IngredientTotalsPage";
 
 
 
 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [summary, setSummary] = useState({
    ingredients: 0,
    specialIngredients: 0,
    finalProducts: 0,
    availableSpaces: 0,
  });
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authFetch({
          method: "get",
          url: `http://localhost:5000/api/staff/auth/userInfo`,
        });
        setUserInfo(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetch dashboard summary
  const fetchSummary = async () => {
    try {
      const res = await authFetch({
        method: "get",
        url: "http://localhost:5000/api/dashboard/summary",
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: "Dashboard", gradient: "from-blue-500 to-cyan-500" },
    { name: "Ingredients", gradient: "from-blue-500 to-cyan-500" },
    { name: "Special Ingredients", gradient: "from-blue-500 to-cyan-500" },
    { name: "Final Products", gradient: "from-blue-500 to-cyan-500" },
    { name: "Storage Zones", gradient: "from-blue-500 to-cyan-500" },
    { name: "User Profile", gradient: "from-blue-500 to-cyan-500" },
    { name: "Ingredient Codes", gradient: "from-blue-500 to-cyan-500" }, // ✅ button in sidebar
    { name: "Ingredient Totals", gradient: "from-blue-500 to-cyan-500" },
    { name: "Request form", gradient: "from-blue-500 to-cyan-500" }, 
     

    
    
  ];

  const renderForm = () => {
    console.log("ActiveTab:", activeTab); // ✅ debug log

    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <p className="text-3xl font-bold mt-2">{summary.ingredients}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold">Special Ingredients</h3>
                <p className="text-3xl font-bold mt-2">{summary.specialIngredients}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold">Final Products</h3>
                <p className="text-3xl font-bold mt-2">{summary.finalProducts}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold">Storage Zones
                </h3>
                <p className="text-3xl font-bold mt-2">{summary.availableSpaces}</p>
              </div>
            </div>

            {/* Profile & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Profile</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">Imasha Athapaththu</p>
                    <p className="text-gray-500 text-sm">Inventory Manager</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>Email: ima.doe@email.com</p>
                  <p>Phone: +94 77 123 4567</p>
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Notifications
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="p-3 bg-gray-100 rounded-lg">
                    🔔 New ingredient "Milk" added.
                  </li>
                  <li className="p-3 bg-gray-100 rounded-lg">
                    ⚠️ Stock low for "Mango".
                  </li>
                  <li className="p-3 bg-gray-100 rounded-lg">
                    ✅ Final product "Milk Yoghurt" approved.
                  </li>
                </ul>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Recent Transactions
              </h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Item</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Quantity(L,kg,Units)</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Milk</td>
                    <td className="p-3">Ingredient</td>
                    <td className="p-3">50 l</td>
                    <td className="p-3">2025-09-01</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Strawberry</td>
                    <td className="p-3">Special Ingredient</td>
                    <td className="p-3">20 kg</td>
                    <td className="p-3">2025-08-28</td>
                  </tr>
                  <tr>
                    <td className="p-3">Milk Yoghurt</td>
                    <td className="p-3">Final Product</td>
                    <td className="p-3">100 units</td>
                    <td className="p-3">2025-08-25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Ingredients":         return <IngredientForm />;
      case "Special Ingredients": return <SpecialIngredientForm />;
      case "Final Products":      return <FinalProductForm />;
      case "Storage Zones":       return <ZoneForm />;
      case "User Profile":        return <UserProfile userInfo={userInfo} />;
      case "Ingredient Codes":    return <IcodePage />; // ✅ load page
      case "Ingredient Totals": return <IngredientTotalsPage />;
      case "Request form":    return <Ing_req_acc_table />;
       
      default:                    return <IngredientForm />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white shadow-lg flex flex-col">
        <h1 className="text-2xl font-bold p-6 text-center border-b border-gray-700">
          Inventory Manager
        </h1>
        <ul className="mt-4 flex-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`cursor-pointer mb-3 rounded-full text-center py-3 mx-4 font-semibold transition-all duration-300
                ${
                  activeTab === item.name
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg transform scale-105`
                    : "bg-gray-700 hover:bg-gray-600 hover:scale-105"
                }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 bg-white p-8 overflow-y-auto">
        <Header userInfo={userInfo} setActiveTab={setActiveTab} />
        <div className="rounded-2xl shadow-md border border-gray-200 p-6 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeTab}</h2>
          {renderForm()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
