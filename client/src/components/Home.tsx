import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Expierence } from './Experience';

function Home() {
    const [powerPoints, setPowerPoints] = useState(50); // Simulación de los Power Points
    const [selectedAvatar] = useState("tsk"); // Avatar por defecto

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
            {/* Header con avatar de usuario, barra de Power Points y engranaje */}
            <div className="flex items-center justify-between w-full px-6 pt-6">
                <div className="flex items-center space-x-2">
                    <img
                        src="/path-to-avatar-icon.png"
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    {/* Barra de Power Points */}
                    <div className="w-32 bg-gray-700 rounded-full h-4">
                        <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{ width: `${powerPoints}%` }}
                        ></div>
                    </div>
                </div>
                {/* Engranaje para logout */}
                <button onClick={handleLogout} className="text-white">
                    <img src="/path-to-gear-icon.png" alt="Settings" className="w-8 h-8" />
                </button>
            </div>

            {/* Avatar en el centro (con tamaño ajustado) */}
            <div className="flex flex-col items-center mt-8 w-full h-full">
                <div className="w-full h-[300px] max-w-lg"> {/* Ajusta el tamaño del canvas */}
                    <Canvas shadows camera={{ position: [0, 0, 6], fov: 30 }}>
                        <color attach="background" args={['#ececec']} />
                        <Expierence />
                    </Canvas>
                </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-around w-full max-w-md pb-6 mt-4">
                <Link to="/avatar" className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-300 transition duration-300">
                    Avatar
                </Link>
                <Link to="/league" className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-300 transition duration-300">
                    League
                </Link>
                <Link to="/Weights" className="bg-white text-black font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-300 transition duration-300">
                    Weights
                </Link>
            </div>
        </div>
    );
}

export default Home;
