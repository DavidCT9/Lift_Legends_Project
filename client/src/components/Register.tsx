import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './General.css'; // Importa el CSS compartido
import axios, { AxiosError } from 'axios';

type ServerErrorResponse = {
    message: string;
};

function Register() {
    const [username, setUsername] = useState('');  // Nuevo campo de username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Para redirigir después del registro

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post(`http://${window.location.hostname}:3000/signup`, {
                name: username,
                username: username,
                email: email,
                password: password,
            });

            if (response.status === 201) {
                console.log("Registro exitoso", response.data);
                navigate('/'); // Redirige al login después del registro exitoso
            } else {
                setError('Registro fallido. Inténtalo de nuevo.');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ServerErrorResponse>;

                if (serverError.response) {
                    // Extract the message from the server's response
                    const message = serverError.response.data?.message ||
                        'Error inesperado.';
                    setError(message);  // Display the message to the user
                    console.log("Response message:", message);
                } else if (serverError.request) {
                    // Request was made but no response received
                    console.error("No response received:", serverError.request);
                    setError('No response from the server. Please try again later.');
                } else {
                    // Other Axios or network errors
                    console.error("Axios error:", serverError.message);
                    setError('Error en el servidor. Inténtalo más tarde.');
                }
            } else {
                // Handle non-Axios errors
                console.error("Unexpected error:", error);
                setError('Ocurrió un error inesperado. Inténtalo más tarde.');
            }
        }

    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h1 className="form-title">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500">{error}</p>} {/* Muestra error si lo hay */}
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-button">Register</button>
                </form>
                <p className="form-link">
                    ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
