import React, { useState } from "react";
import { ShoppingCart, User, Heart } from "lucide-react";
import CustomizedOrderPage from "./CustomizedOrderPage";
import ReturnsCustomer from "./ReturnsCustomer";

const YogurtLandingPage = () => {
  const [selectedFlavor, setSelectedFlavor] = useState("blueberry");
  const [activePage, setActivePage] = useState("landing"); // landing | customize | returns

  // Use public/ paths (no import needed). Make sure these files exist.
  const flavors = [
    {
      id: "blueberry",
      name: "Blueberry Burst",
      image: "/images_sadi/yoghurt1.png",
      color: "from-blue-400 to-purple-500",
    },
    {
      id: "strawberry",
      name: "Strawberry Dream",
      image: "/images_sadi/yoghurt2.png",
      color: "from-pink-400 to-red-500",
    },
    {
      id: "vanilla",
      name: "Vanilla Smooth",
      image: "/images_sadi/yoghurt3.png",
      color: "from-yellow-300 to-orange-400",
    },
  ];

  const activeFlavor = flavors.find((f) => f.id === selectedFlavor) ?? flavors[0];

  // Hand-off to other pages (with Back support)
  if (activePage === "customize") {
    return <CustomizedOrderPage onBack={() => setActivePage("landing")} />;
  }
  if (activePage === "returns") {
    return <ReturnsCustomer onBack={() => setActivePage("landing")} />;
  }

  // Landing page UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">YogurtCraft</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Customize</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Nutrition</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors">
              <ShoppingCart className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Yogurt Display */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl p-12 relative overflow-hidden min-h-[600px] flex items-center justify-center">
              {/* Background Decorations */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 right-16 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse delay-500"></div>
              </div>

              {/* Brand Badge */}
              <div className="absolute top-6 left-6 bg-white bg-opacity-90 rounded-full px-4 py-2">
                <span className="text-blue-600 font-semibold text-sm">20+ Flavors</span>
              </div>

              {/* Main Yogurt Container */}
              <div className="relative z-10">
                <div className="w-80 h-110 bg-white rounded-t-full rounded-b-3xl shadow-2xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  {/* Yogurt Top */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-80 h-100 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full shadow-inner"></div>

                  {/* Yogurt Content */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-60 h-72 bg-gradient-to-b from-blue-100 via-white to-blue-50 rounded-full opacity-90"></div>

                  {/* Swirl Effect */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-40 h-60 bg-gradient-to-b from-blue-200 to-transparent rounded-full opacity-60 animate-pulse"></div>

                  {/* BIG selected flavor image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%] w-72 h-72 md:w-100 md:h-100 rounded-2xl overflow-visible">
                    <img
                      src={activeFlavor.image}
                      alt={activeFlavor.name}
                      className="w-full h-full object-contain drop-shadow-2xl select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-blue-600 mb-6 leading-tight">
                Craft Your Perfect
                <span className="block text-blue-800">Healthy Yogurt</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Embark on a delightful journey of creating personalized yogurt bowls with fresh ingredients,
                probiotics, and natural sweetness. Where health meets indulgence in every spoonful.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setActivePage("customize")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-[1.05] shadow-lg"
              >
                Customize Now
              </button>
              <button
                type="button"
                onClick={() => setActivePage("returns")}
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Manage Returns
              </button>
            </div>

            {/* Popular Flavors */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Popular Flavors</h3>

              <div className="grid grid-cols-3 gap-4">
                {flavors.map((flavor) => {
                  const isActive = selectedFlavor === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setSelectedFlavor(flavor.id)}
                      className={`relative group text-left transition-transform duration-200 ${
                        isActive ? "scale-105" : "hover:scale-[1.02]"
                      }`}
                    >
                      <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                        {/* 1:1 square wrapper */}
                        <div className="relative w-full pt-[100%] mb-3 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={flavor.image}
                            alt={flavor.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable={false}
                          />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm text-center">
                          {flavor.name}
                        </h4>

                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <span className="w-2 h-2 bg-white rounded-full" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YogurtLandingPage;
