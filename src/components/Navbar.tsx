import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Navigation bar component
 * @returns Navigation bar component
 */
const NavBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { user } = useAuth();

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <nav className="bg-white p-4 flex gap-4 items-center shadow-sm w-full">
            <NavLink to="/">Dashboard</NavLink>
            {user?.rolePermission?.product?.readProducts?.access && (
                <NavLink to="/products">Products</NavLink>
            )}
            {user?.rolePermission?.productCategory?.readProductCategories?.access && (
                <NavLink to="/products/categories">Product Categories</NavLink>
            )}
            {user?.rolePermission?.user?.readUsers?.access && (
                <NavLink to="/users">Users</NavLink>
            )}
            <button onClick={handleLogout}>Logout</button>
            <span className="text-gray-600">{user?.user_first_name} {user?.user_last_name}</span>
        </nav>
    )
}

export default NavBar;