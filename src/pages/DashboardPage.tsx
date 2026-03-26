import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { User } from "../types/user";

/**
 * Dashboard page component
 * Displays a list of users from the API
 */
function DashboardPage() {

    const [users, setUsers] = useState<User[]>([]); // Array of users from the API

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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to ERP-Demo</p>
            <table className="mt-4 w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td className="border border-gray-300 px-4 py-2">{user.first_name} {user.last_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPage;


