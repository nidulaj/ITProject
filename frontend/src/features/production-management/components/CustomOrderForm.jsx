import React, { useMemo } from "react";
import { User, Mail, Calendar, MapPin, Package, Sparkles } from "lucide-react";

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
    <div className="bg-white shadow-xl rounded-3xl p-8 border border-blue-100 mb-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-600">
            {editing ? "Edit Your Custom Yogurt" : "Create Your Perfect Yogurt"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {editing ? "Update your custom order details" : "Design your personalized yogurt experience"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">!</span>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {ok && (
        <div className="mb-6 p-4 rounded-xl border border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="font-medium">{ok}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-600">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                value={value.customer_name || ""}
                onChange={(e)=>set("customer_name", e.target.value)}
                placeholder="Enter your full name" 
                maxLength={120} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                value={value.email || ""}
                onChange={(e)=>set("email", e.target.value)}
                placeholder="your@email.com" 
                maxLength={160} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Delivery Date
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                  value={value.order_date || minDate}
                  onChange={(e)=>set("order_date", e.target.value)}
                  min={minDate} 
                  required 
                />
                {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
              </div>
              <p className="text-xs text-blue-600 font-medium">
                Earliest available: {new Date(minDate).toLocaleDateString()}
              </p>
            </div>

            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Delivery Address
              </label>
              <div className="relative">
                <textarea 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300 resize-none"
                  rows={3}
                  value={value.address || ""}
                  onChange={(e)=>set("address", e.target.value)}
                  placeholder="Enter your complete delivery address" 
                  required 
                />
                <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-600">Yogurt Customization</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Choose Your Fruit
              </label>
              <select 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300 bg-white"
                value={value.fruit || ""} 
                onChange={(e)=>set("fruit", e.target.value)} 
                required
              >
                <option value="">Select your favorite fruit...</option>
                {FRUITS.map(f => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Choose Your Topping
              </label>
              <select 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300 bg-white"
                value={value.topping || ""} 
                onChange={(e)=>set("topping", e.target.value)} 
                required
              >
                <option value="">Select your topping...</option>
                {TOPPINGS.map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Choose Your Base
              </label>
              <select 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300 bg-white"
                value={value.bottom || ""} 
                onChange={(e)=>set("bottom", e.target.value)} 
                required
              >
                <option value="">Select your base...</option>
                {BOTTOMS.map(b => (
                  <option key={b} value={b}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="50"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-gray-300"
                value={value.quantity || ""}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="How many?"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200"
            >
              Clear Form
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center min-w-[160px]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                {editing ? "Update Order" : "Place Order"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}