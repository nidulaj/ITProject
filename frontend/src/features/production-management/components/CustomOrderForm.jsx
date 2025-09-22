import React, { useMemo } from "react";

const FRUITS = ["strawberry", "blueberry", "mango"];
const TOPPINGS = ["chocolate syrup", "strawberry syrup", "honey syrup"];
const BOTTOMS = ["cashew", "peanut", "armond"]; // keep 'armond' to match DB

function minDateISO() {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0,10);
}

export default function CustomOrderForm({
  value,
  onChange,
  onSubmit,
  submitting = false,
  editing = false,
  error = "",
  ok = "",
}) {
  const minDate = useMemo(minDateISO, []);
  const set = (k, v) => onChange?.({ ...value, [k]: v });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100 mb-8 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
          <span className="text-white font-bold text-xl">🥛</span>
        </div>
        <h2 className="text-2xl font-bold text-blue-800">
          {editing ? "Edit Your Custom Yogurt" : "Create Your Perfect Yogurt"}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-sm">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}
      
      {ok && (
        <div className="mb-6 p-4 rounded-xl border border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-sm">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            {ok}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information Section */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Personal Information
          </h3>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            Full Name
          </label>
          <input 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
            value={value.customer_name || ""}
            onChange={(e)=>set("customer_name", e.target.value)}
            placeholder="Enter your full name" 
            maxLength={120} 
            required 
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            Email Address
          </label>
          <input 
            type="email" 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
            value={value.email || ""}
            onChange={(e)=>set("email", e.target.value)}
            placeholder="your@email.com" 
            maxLength={160} 
            required 
          />
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            Delivery Date
          </label>
          <input 
            type="date" 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
            value={value.order_date || minDate}
            onChange={(e)=>set("order_date", e.target.value)}
            min={minDate} 
            required 
          />
          <p className="text-xs text-blue-600 mt-1 font-medium">
            📅 Earliest available: {new Date(minDate).toLocaleDateString()}
          </p>
        </div>

        <div className="lg:col-span-3 group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            Delivery Address
          </label>
          <textarea 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300 resize-none"
            rows={3}
            value={value.address || ""}
            onChange={(e)=>set("address", e.target.value)}
            placeholder="Enter your complete delivery address" 
            required 
          />
        </div>

        {/* Customization Section */}
        <div className="lg:col-span-3 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Yogurt Customization
          </h3>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            🍓 Choose Your Fruit
          </label>
          <select 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300 bg-white"
            value={value.fruit || ""} 
            onChange={(e)=>set("fruit", e.target.value)} 
            required
          >
            <option value="">Select your favorite fruit...</option>
            {FRUITS.map(f => (
              <option key={f} value={f} className="py-2">
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            🍯 Choose Your Topping
          </label>
          <select 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300 bg-white"
            value={value.topping || ""} 
            onChange={(e)=>set("topping", e.target.value)} 
            required
          >
            <option value="">Select your topping...</option>
            {TOPPINGS.map(t => (
              <option key={t} value={t} className="py-2">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            🥜 Choose Your Base
          </label>
          <select 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300 bg-white"
            value={value.bottom || ""} 
            onChange={(e)=>set("bottom", e.target.value)} 
            required
          >
            <option value="">Select your base...</option>
            {BOTTOMS.map(b => (
              <option key={b} value={b} className="py-2">
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-gray-700 group-focus-within:text-blue-600 transition-colors">
            📦 Quantity
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-300"
            value={value.quantity || ""}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder="How many yogurts?"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
          {editing && (
            <button 
              type="button" 
              onClick={()=>onChange?.({ 
                customer_name:"", 
                address:"", 
                email:"", 
                fruit:"", 
                topping:"", 
                bottom:"", 
                quantity: 1,
                order_date:minDate 
              })}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 flex items-center justify-center"
            >
              🗑️ Clear Form
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={submitting}
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center min-w-[160px]"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {editing ? "✏️ Update Order" : "🚀 Place Order"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}