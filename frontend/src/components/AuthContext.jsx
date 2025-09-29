import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("user"));

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    // keep isLoggedIn in sync
    setIsLoggedIn(Boolean(user));
  }, [user]);

  // call this to log out from anywhere
  const logout = () => {
    console.log("Logging out user:", user);
    setUser(null);
    setIsLoggedIn(false);
    console.log("User logged out", user);
    localStorage.removeItem("user");

    // notify other parts of app (SupportWidget listens for this)
    window.dispatchEvent(new Event("user-logout"));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}