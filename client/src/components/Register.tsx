import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './General.css';
import axios, { AxiosError } from 'axios';

type ServerErrorResponse = {
    message: string;
};

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords are not the same');
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
                navigate('/');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const serverError = error as AxiosError<ServerErrorResponse>;

                if (serverError.response) {
                    // Extract the message from the server's response
                    const message = serverError.response.data?.message ||
                        'Unexpected error.';
                    setError(message);  // Display the message to the user
                    console.log("Response message:", message);
                } else if (serverError.request) {
                    // Request was made but no response received
                    console.error("No response received:", serverError.request);
                    setError('No response from the server. Please try again later.');
                } else {
                    // Other Axios or network errors
                    console.error("Axios error:", serverError.message);
                    setError('Server error. Please try again later.');
                }
            } else {
                // Handle non-Axios errors
                console.error("Unexpected error:", error);
                setError('An unexpected error occurred. Please try again later.');
            }
        }

    };

    return (
        <div className="relative py-6 sm:max-w-xl sm:mx-auto w-full">
            <div className="relative px-4 py-10  mx-8 md:mx-0 shadow rounded-3xl sm:p-10" style={{
                backdropFilter: 'blur(10px)', background: 'rgba(0, 0, 0, 0.6)', WebkitBackdropFilter: 'blur(10px)', boxShadow: `
0 4px 30px rgba(0, 0, 0, 0.2),
0 0 20px rgba(0, 0, 139, 0.8), 
0 0 50px rgba(0, 0, 128, 0.5)  
` }}>
                <div className="max-w-md mx-auto text-white">
                    <div className="flex  sm:mx-auto items-center  justify-center max-w-32">
                        <img src='../../public/liftLegendsLogo.svg' alt='Logo' />
                    </div>
                    <div className="text-center pt-2  text-3xl font-bold">
                        Hey, Welcome!
                    </div>

                    <form onSubmit={handleSubmit} >
                        {error && <p className="text-red-500 pt-2 font-semibold text-center">{error}</p>}

                        <div className="mt-5">

                            <label htmlFor="username" className="font-semibold text-sm text-gray-400 pb-1 block">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-700 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                                required />

                            <label htmlFor="email" className="font-semibold text-sm text-gray-400 pb-1 block">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-700 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                                required />

                            <label htmlFor="password" className="font-semibold text-sm text-gray-400 pb-1 block">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-700 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                                required />

                            <label htmlFor="confirm-password" className="font-semibold text-sm text-gray-400 pb-1 block">Confirm Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-gray-700 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500"
                                required />
                        </div>
                        <div className="mt-5">
                            <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                                Register
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
                        <a href="#" className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"> <Link to="/">Already have an account?</Link></a>
                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
