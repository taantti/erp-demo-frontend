import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { LoginRequest, LoginResponse } from "../types/auth";
import { AxiosError } from "axios";
import { useAuth} from "../context/AuthContext";

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


    const handleSubmit = async (event: React.FormEvent) => {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <input
                    type="text"
                    value={username}
                    onChange={(event) => {
                        setUsername(event.target.value);
                        setError("");
                    }}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                    }}
                    placeholder="Password"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    )
};

export default LoginPage;
