import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Interface for protected route props
 * @interface ProtectedRouteProps
 * @param {React.ReactNode} children - The content to render if authenticated
 */
interface ProtectedRouteProps {
    children: React.ReactNode
}

/**
 * Protected route component that checks authentication before rendering children
 * @param children - The content to render if authenticated
 * @returns Navigate component to login page if not authenticated, otherwise the children
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" />

    return children;
}

export default ProtectedRoute