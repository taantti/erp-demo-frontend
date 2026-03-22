import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { LoginRequest, LoginResponse } from "../types/auth";

/**
 * Login page component
 * @returns Login page
 */
function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(username, password);
        const loginRequest: LoginRequest = {
            username: username,
            password: password
        }

        try {
            const loginResponse = await api.post<LoginResponse>('/login', loginRequest);
            if(loginResponse.status !== 200) {
                throw new Error('Login failed');
            }

            if(loginResponse.data.login) {
                localStorage.setItem('token', loginResponse.data.login);
                navigate('/');
            }


        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2x1 font-bold">Login</h1>
            <form className="bg-white rounded-lg shadow-md p-8" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username" />
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    )
};



export default LoginPage;
