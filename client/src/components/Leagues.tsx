import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
    username: string;
    currentLeague: number;
    weeklyPoints: {
        total: number;
    };
};

type League = {
    rank: number;
    users: User[];
};

function Leagues() {
    const [league, setLeague] = useState<League | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        const currentLeague = localStorage.getItem('currentLeague');

        if (!username || !currentLeague) {
            setError('No se encontró la información del usuario en localStorage.');
            return;
        }

        const fetchUserLeague = async () => {
            try {
                // Usamos la liga actual del usuario (almacenada en localStorage) para obtener la información de esa liga
                const response = await axios.post('http://localhost:3000/getleagueinfo', {
                    rank: parseInt(currentLeague),
                });

                if (response.status === 200) {
                    setLeague(response.data.league);
                } else {
                    setError('No se encontró la liga del usuario.');
                }
            } catch (error) {
                console.error('Error al obtener la liga:', error);
                setError('Ocurrió un error al obtener la liga.');
            }
        };

        fetchUserLeague();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white flex items-center justify-center">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : league ? (
                <div className="w-11/12 max-w-4xl bg-white text-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">Ligas</h1>
                    {league.users.map((user, index) => (
                        <div
                            key={user.username}
                            className="flex justify-between items-center py-2 px-4 border-b last:border-b-0 border-gray-300"
                        >
                            <span className="text-xl font-medium">{index + 1}. {user.username}</span>
                            <span className={`text-lg ${user.weeklyPoints.total > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                {user.weeklyPoints.total} pts
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Cargando información de la liga...</p>
            )}
        </div>
    );
}

export default Leagues;