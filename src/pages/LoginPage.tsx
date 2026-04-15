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
    const [username, setUsername] = useState<string>(""); // Mitä <string> tekee? Paluu arvon tyyppi vai parametrin tyyppi? 
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
        console.log(username, password);
        const loginRequest: LoginRequest = {
            username: username,
            password: password
        }

        try {
            const loginResponse = await api.post<LoginResponse>('/login', loginRequest); // Mitä <LoginResponse> tekee? Paluu arvon tyyppi vai parametrin tyyppi? 
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
        <div className="d-flex align-items-center justify-content-center flex-grow-1">
            <h1 className="fs-4 fw-bold">Login</h1>
            <form className="bg-white rounded shadow p-4" onSubmit={handleSubmit}>
                {error && <p className="text-danger small mt-2">{error}</p>}
                <input
                    className="form-control mt-2"
                    type="text"
                    value={username}
                    onChange={(event) => {
                        setUsername(event.target.value);
                        setError("");
                    }}
                    placeholder="Username"
                />
                <input
                    className="form-control mt-2"
                    type="password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                    }}
                    placeholder="Password"
                />
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
        </div>
    )
};

export default LoginPage;
