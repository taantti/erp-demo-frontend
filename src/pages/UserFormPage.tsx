import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { UserRequest } from "../types/user";
import { AxiosError } from "axios";

/**
 * Return user form page
 * @returns User form page
 */
function UserFormPage() {
    const [formData, setFormData] = useState<UserRequest>({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        active: true
    });

    const [error, setError] = useState<string>("");
    const [roles, setRoles] = useState<string[]>([]);
    const navigate = useNavigate();
    const { id: userId } = useParams();

    /**
     * Load user data if editing
     */
    useEffect(() => {
        if (userId) {
            api.get(`/user/${userId}`)
                .then(response => {
                    const user = response.data;
                    setFormData({
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role: user.role,
                        active: user.active
                    });
                })
                .catch(error => setError(error.response?.data?.error || "User retrieval failed"));
        }
    }, [userId]);

    /**
     * Load user roles
     */
    useEffect(() => {
        api.get<string[]>("/asset/user/roles")
            .then(response => setRoles(response.data))
            .catch(error => setError(error.response?.data?.error || "User roles retrieval failed"));
    }, []);


    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (userId) {
                await api.put(`/user/${userId}`, formData);
            } else {
                await api.post('/user', formData);
            }
            navigate("/users");
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.error || "User creation failed");
            } else {
                setError("Unknown error");
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">User form</h1>
            <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <label className="block mt-4 font-medium">Username
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={(event) => {
                            setFormData({ ...formData, username: event.target.value });
                            setError("");
                        }}
                        placeholder="Username"
                    />
                </label>
                {!userId && (
                    <label className="block mt-4 font-medium">Password
                        <input
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(event) => {
                                setFormData({ ...formData, password: event.target.value });
                                setError("");
                            }}
                            placeholder="Password"
                        />
                    </label>
                )}
                <label className="block mt-4 font-medium">First name(s)
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(event) => {
                            setFormData({ ...formData, first_name: event.target.value });
                            setError("");
                        }}
                        placeholder="First name"
                    />
                </label>
                <label className="block mt-4 font-medium">Last name
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(event) => {
                            setFormData({ ...formData, last_name: event.target.value });
                            setError("");
                        }}
                        placeholder="Last name"
                    />
                </label>
                <label className="block mt-4 font-medium">Email
                    <input
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={(event) => {
                            setFormData({ ...formData, email: event.target.value });
                            setError("");
                        }}
                        placeholder="Email"
                    />
                </label>
                <label className="block mt-4 font-medium">Role
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        name="role"
                        value={formData.role}
                        onChange={(event) => {
                            setFormData({ ...formData, role: event.target.value });
                            setError("");
                        }}
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </label>
                <label className="block mt-4 font-medium">Active
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        name="active"
                        value={formData.active.toString()}
                        onChange={(event) => {
                            setFormData({ ...formData, active: event.target.value === "true" });
                            setError("");
                        }}
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </form>
        </div>
    );
}

export default UserFormPage;
