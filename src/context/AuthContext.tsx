import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * Interface for the authentication context
 * Defines the structure of the authentication context
 */
interface AuthContextType {
    token: string | null,           // User token or null if not authenticated
    login: (token: string) => void, // Function to set the token
    logout: () => void,             // Function to remove the token
    isAuthenticated: boolean        // Boolean indicating if the user is authenticated
}

/**
 * Create the authentication context
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider component that provides authentication context to its children
 * @param children - The children to render
 * @returns The provider component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    /**
     * Login function that sets the token in local storage and state
     * @param newToken - The new token to set
     * @returns void
     */
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    /**
     * Logout function that removes the token from local storage and state
     * @returns void
     */
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    /**
     * Return the provider component with the authentication context
     * @returns The provider component
     */
    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
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



