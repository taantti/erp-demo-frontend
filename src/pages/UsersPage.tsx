import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { User } from "../types/user";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Users page component
 * Displays a list of users from the API
 */
function UsersPage() {

    const [users, setUsers] = useState<User[]>([]); // Array of users from the API
    const { userData } = useAuth(); // Get the current user from the auth context

    // Handle delete user
    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(`/user/${userId}`);
            setUsers(users.filter((user) => user._id !== userId)); // Remove the deleted user from the list
        } catch (error) {
            console.log("Error deleting user:", error);
        }
    }

    // Fetch users from the API on component mount
    useEffect(() => {
        api.get<User[]>("/user/")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.log("Error data:", err.response?.data);
            });
    }, []);

    return (
        <div className="p-8">
            <ul>
                {userData?.rolePermission?.user?.createUser?.access && (
                    <li><Link to="/users/new">New user</Link></li>
                )}
            </ul>
            <table className="mt-4 w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Username</th>
                        <th className="border border-gray-300 px-4 py-2">First name(s)</th>
                        <th className="border border-gray-300 px-4 py-2">Last name</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                        <th className="border border-gray-300 px-4 py-2">Active</th>
                        <th className="border border-gray-300 px-4 py-2">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.first_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.last_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.active ? "Yes" : "No"}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userData?.rolePermission?.user?.updateUser?.access && (
                                    <Link to={`/users/${user._id}/edit`}>
                                        Edit <img src="/edit.png" alt="Edit" />
                                    </Link>
                                )}
                                {userData?.rolePermission?.user?.deleteUser?.access && (
                                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;


