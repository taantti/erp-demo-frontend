import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { LoginRequest, LoginResponse } from "../types/auth";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

/**
 * Login page component
 * @returns Login page
 */
function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { login } = useAuth();

    /**
     * Handle form submission
     * @param event Form submission event
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const loginRequest: LoginRequest = {
            username: username,
            password: password
        }

        try {
            const loginResponse = await api.post<LoginResponse>('/login', loginRequest);
            if (loginResponse.status !== 200) {
                throw new Error('Login failed');
            }

            if (loginResponse.data.login) {
                login(loginResponse.data.login);
                navigate('/');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                setError(error.response?.data?.error || "Login failed");
            } else {
                console.log("Unknown error");
                setError("Unknown error");
            }
        }
    }

    /**
     * Return the login page
     * @returns Login page
     */
    return (
        <div className="d-flex align-items-center justify-content-center flex-grow-1 p-3">
            <div className="card border-0 shadow w-100" style={{ maxWidth: "400px" }}>
                <div className="card-body p-4 p-sm-5">
                    <h1 className="fs-3 fw-bold text-center mb-4">Login</h1>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger py-2 small">{error}</div>}
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                id="username"
                                className="form-control"
                                type="text"
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                    setError("");
                                }}
                                placeholder="Username"
                                autoComplete="username"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                }}
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default LoginPage;
