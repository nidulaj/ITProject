import React, { createContext, useSate, useEffect, useState } from "react"

export const AuthContext = createContext()

export function AuthProvider({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true")

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn)
    }, [isLoggedIn])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}