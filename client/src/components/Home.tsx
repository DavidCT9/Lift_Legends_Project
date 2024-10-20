import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Expierence } from './Experience';

function Home() {
    const [powerPoints] = useState(50); // Simulación de Power Points

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div className="relative min-h-screen w-full">
            {/* Canvas que ocupa toda la pantalla */}
            <Canvas className="absolute inset-0">
                <color attach="background" args={['#ececec']} />
                <Expierence />
            </Canvas>

            {/* Header con avatar, barra de Power Points y logout */}
            <div className="absolute top-4 left-4 flex items-center space-x-4">
                <img
                    src="/path-to-avatar-icon.png"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                />
                <div className="w-40 bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${powerPoints}%` }}
                    ></div>
                </div>
            </div>

            {/* Botón de logout */}
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-600 flex items-center justify-center"
            >
                <img src="/path-to-gear-icon.png" alt="Settings" className="w-6 h-6" />
            </button>

            {/* Botones de navegación ajustados */}
            <div className="absolute bottom-20 w-full flex justify-around px-6">
                <Link
                    to="/avatar"
                    className="bg-white text-black font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
                >
                    Avatar
                </Link>
                <Link
                    to="/leagues"
                    className="bg-white text-black font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
                >
                    Leagues
                </Link>
                <Link
                    to="/weights"
                    className="bg-white text-black font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
                >
                    Weights
                </Link>
            </div>
        </div>
    );
}

export default Home;
