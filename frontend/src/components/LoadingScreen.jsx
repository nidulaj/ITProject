import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-spin"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
          
          {/* Outer glow effect */}
          <div className="absolute inset-0 bg-blue-400 dark:bg-blue-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Loading
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please wait while we prepare your experience
        </p>

        {/* Animated Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}