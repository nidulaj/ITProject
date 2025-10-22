// components/ActionButton.jsx
import React from 'react';

const ActionButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  icon: Icon,
  className = '' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500';  //bg-orange-500 hover:bg-orange-600 text-white border-orange-500
      case 'secondary':
        return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500';  //bg-gray-500 hover:bg-gray-600 text-white border-gray-500
      case 'outline':
        return 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500';  //bg-white hover:bg-gray-50 text-gray-700 border-gray-300
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white border-green-500';  //bg-green-500 hover:bg-green-600 text-white border-green-500
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-500';  //bg-red-500 hover:bg-red-600 text-white border-red-500
      default:
        return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500';  //bg-orange-500 hover:bg-orange-600 text-white border-orange-500
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm';
      case 'medium':
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center font-medium rounded-lg border transition-colors
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {Icon && <Icon className="mr-2" size={16} />}
      {children}
    </button>
  );
};

export default ActionButton;