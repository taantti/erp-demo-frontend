import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Navigation bar component
 * @returns Navigation bar component
 */
const NavBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <nav className="bg-white p-4 flex gap-4 items-center">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/products/categories">Product Categories</NavLink>
            <button onClick={handleLogout}>Logout</button>    
        </nav>
    )
}

export default NavBar;