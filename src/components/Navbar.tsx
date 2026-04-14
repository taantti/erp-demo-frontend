import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

/**
 * Navigation bar component
 * @returns Navigation bar component
 */
const NavBar = () => {
    const { logout, userData } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <nav className="bg-white p-4 shadow-sm w-full">
            <div className="flex items-center justify-between">
            <button
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>
            </div>
            <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4 mt-2 md:mt-0`}>
                <NavLink to="/">Dashboard</NavLink>

                {userData?.rolePermission?.product?.readProducts?.access && (
                    <NavLink to="/products">Products</NavLink>
                )}
                {userData?.rolePermission?.productCategory?.readProductCategories?.access && (
                    <NavLink to="/products/categories">Product Categories</NavLink>
                )}
                {userData?.rolePermission?.user?.readUsers?.access && (
                    <NavLink to="/users">Users</NavLink>
                )}

<button onClick={handleLogout} className="bg-transparent border-none p-0 m-0 cursor-pointer font-[inherit] text-[inherit] text-left">
    Logout
</button>
                <span className="text-gray-600">{userData?.user_first_name} {userData?.user_last_name}</span>
            </div>
        </nav>
    )
}

export default NavBar;