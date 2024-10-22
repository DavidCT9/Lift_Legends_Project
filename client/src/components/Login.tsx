import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './General.css';
import axios, { AxiosError } from 'axios';

type ServerErrorResponse = {
    message: string;
};

function Login() {
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://${window.location.hostname}:3000/login`, {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                console.log("Login successful", response.data.user);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('currentLeague', response.data.user.currentLeague);
                navigate('/home');
            } else {
                setError("Login fallido. Verifica tus credenciales.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ServerErrorResponse>;

                if (serverError.response) {
                    const message = serverError.response.data?.message || 'Error inesperado.';
                    setError(message);
                    console.log("Response message:", message);
                } else if (serverError.request) {
                    console.error("No response received:", serverError.request);
                    setError('No response from the server. Please try again later.');
                } else {
                    console.error("Axios error:", serverError.message);
                    setError('Error en el servidor. Inténtalo de nuevo más tarde.');
                }
            } else {
                console.error("Unexpected error:", error);
                setError('Ocurrió un error inesperado. Inténtalo más tarde.');
            }
        }
    };


    return (
        <div className="form-container">
            <div className="form-box">
                <h1 className="form-title">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-button">Log In</button>
                </form>
                <p className="form-link">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
