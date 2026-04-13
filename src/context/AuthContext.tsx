import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TokenPayload } from '../types/auth';
import { decodeToken } from '../utils/token';

/**
 * Interface for the authentication and user context
 * Defines the structure of the authentication and user context
 */
interface AuthContextType {
    token:           string | null,           // User token or null if not authenticated
    userData:        TokenPayload | null,     // User payload or null if not authenticated
    login:           (token: string) => void, // Function to set the token
    logout:          () => void,              // Function to remove the token
    isAuthenticated: boolean                  // Boolean indicating if the user is authenticated
}

/**
 * Create the authentication and user context
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider component that provides authentication and user context to its children
 * @param children - The children to render
 * @returns The provider component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    /**
     * State for the token
     */
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    /**
     * State for the user
     */
    const [user, setUser] = useState<TokenPayload | null>(() => {
        const savedToken = localStorage.getItem("token");
        return savedToken ? decodeToken(savedToken) : null;
    });

    /**
     * Login function that sets the token and user data in local storage and state
     * @param newToken - The new token to set
     * @returns void
     */
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(decodeToken(newToken));
    }

    /**
     * Logout function that removes the token and user data from local storage and state
     * @returns void
     */
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    /**
     * Return the provider component with the authentication and user context
     * @returns The provider component
     */
    return (
        <AuthContext.Provider value={{ token, userData: user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to use the authentication context
 * @returns The authentication context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw Error("useAuth must be used within an AuthProvider");
    return context;
}



