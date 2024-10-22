import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Expierence } from './Experience';
import axios from 'axios';

function Home() {
    const [powerPoints, setPowerPoints] = useState(0);
    const [maxPoints, setMaxPoints] = useState(100); 
    const [league, setLeague] = useState<number | null>(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        const currentLeague = localStorage.getItem('currentLeague');

        if (username && currentLeague) {
            setLeague(parseInt(currentLeague));

            // Obtenemos los detalles de la liga actual
            const fetchLeagueDetails = async () => {
                try {
                    const response = await axios.post(`http://${window.location.hostname}:3000/getleagueinfo`, {
                        rank: parseInt(currentLeague),
                    });

                    if (response.status === 200) {
                        const leagueData = response.data.league;

                        switch (parseInt(currentLeague)) {
                            case 0:
                                setMaxPoints(100);
                                break;
                            case 1:
                                setMaxPoints(200);
                                break;
                            case 2:
                                setMaxPoints(300);
                                break;
                            default:
                                setMaxPoints(100); 
                        }

                        const user = leagueData.users.find((u: any) => u.username === username);
                        if (user) {
                            setPowerPoints(user.weeklyPoints.total);
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener los detalles de la liga:', error);
                }
            };

            fetchLeagueDetails();
        }
    }, []);

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div className="relative min-h-screen w-full">
            <Canvas className="absolute inset-0" shadows camera={{ position: [0, -0.2, 9], fov: 30 }}>
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
                        style={{ width: `${(powerPoints / maxPoints) * 100}%` }}
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
