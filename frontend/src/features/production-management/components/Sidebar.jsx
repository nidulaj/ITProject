// components/Sidebar.jsx
import React from 'react';
import { Home, Factory, ChefHat, Package, RotateCcw, Check, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ activeTab, setActiveTab, darkMode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },

    { id: 'order', label: 'Order Management', icon: Check },
    
    { id: 'recipes', label: 'Recipe Management', icon: ChefHat },
    { id: 'ingredients', label: 'Ingredient Requests', icon: Package },
    { id: 'productions', label: 'Manage Productions', icon: Factory },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'userProfile', label: 'User Profile', icon: User }

  ];

  return (
    <div className={`${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700' 
        : 'bg-gradient-to-b from-blue-900 to-blue-800 border-blue-700'
    } text-white w-72 min-h-screen p-6 border-r shadow-2xl`}>
      
      {/* Logo Section */}
      <div className="mb-10">
        <div className={`${
          darkMode ? 'bg-gray-800' : 'bg-blue-800/50'
        } backdrop-blur-sm rounded-xl p-4 border ${
          darkMode ? 'border-gray-600' : 'border-blue-600/30'
        }`}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-1">
            PRODUCTION
          </h2>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            MANAGER
          </h2>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? `${darkMode 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25'
                    } text-white transform scale-[1.02]` 
                  : `${darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-blue-200 hover:bg-white/10'
                    } hover:text-white hover:transform hover:scale-105`
                }
              `}
            >
              <div className={`
                p-2 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-white/20' 
                  : `${darkMode ? 'bg-gray-600/50' : 'bg-blue-700/50'} group-hover:bg-white/20`
                }
              `}>
                <Icon size={20} />
              </div>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Accent */}
      {/* <div className={`mt-auto pt-8 border-t ${
        darkMode ? 'border-gray-600' : 'border-blue-600/30'
      }`}>
        <div className={`${
          darkMode 
            ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
            : 'bg-gradient-to-r from-blue-700 to-blue-600'
        } rounded-lg p-3 text-center`}>
          <p className="text-xs text-blue-200">Pubudu Production System v2.0</p>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;