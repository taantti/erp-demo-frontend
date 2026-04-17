import { useEffect, useState } from 'react';
import api from "../api/axios";
import type { User } from "../types/user";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationComponent from "../components/Pagination";

/**
 * Users page component
 * Displays a list of users from the API
 */
function UsersPage() {

    const [users, setUsers] = useState<User[]>([]); // Array of users from the API
    const { userData } = useAuth(); // Get the current user from the auth context
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Handle delete user
    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(`/user/${userId}`);
            setUsers(users.filter((user) => user._id !== userId)); // Remove the deleted user from the list
            setCurrentPage(1);
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

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">

            {userData?.rolePermission?.user?.createUser?.access && (
                <Link to="/users/new" className="btn btn-primary mb-3">New user</Link>
            )}

            <table className="table table-bordered table-striped mt-3">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First name(s)</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.active ? "Yes" : "No"}</td>
                            <td>
                                {userData?.rolePermission?.user?.updateUser?.access && (
                                    <Link to={`/users/${user._id}/edit`} className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil"></i> Edit</Link>
                                )}
                                {userData?.rolePermission?.user?.deleteUser?.access && (
                                    <button onClick={() => handleDelete(user._id)} className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default UsersPage;


