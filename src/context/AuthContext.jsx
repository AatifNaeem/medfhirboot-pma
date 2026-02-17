import { createContext, useContext, useEffect, useState } from "react";
import { decodeJwt } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            setUser(decodeJwt(storedToken));
        }
        setLoading(false);
    }, []);

    function login(jwtToken) {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
        setUser(decodeJwt(jwtToken));
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    const value = {
        token,
        isAuthenticated: !!token,
        login,
        logout
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
