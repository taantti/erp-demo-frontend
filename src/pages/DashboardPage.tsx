import { useContext, useEffect, useState } from 'react';
import api from "../api/axios";
import type { User } from "../types/user";


function DashboardPage() {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        console.log("Token:", localStorage.getItem("token"));
        api.get<User[]>("/user/")
            .then((res) => {
                console.log("Response:", res.data);
                setUsers(res.data);
            })
            .catch((err) => {
                console.log("Error status:", err.response?.status);
                console.log("Error data:", err.response?.data);
                console.log("Request headers:", err.config?.headers);
            });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to ERP-Demo</p>
            <table className="mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPage;


