import { useEffect, useState } from 'react';
import axios from 'axios';

import AineImg from './ImagesSkins/Aine.png';
import JesusImg from './ImagesSkins/Jesus.png';
import VesperaImg from './ImagesSkins/Vespera.png';
import WendyImg from './ImagesSkins/Wendy.png';
import { useAuthContext } from './AuthContext';
import { Navbar } from './Navbar';

type Skin = {
    id: number;
    name: string;
    image: string;
};

const skins: Skin[] = [
    { id: 0, name: 'Aine', image: AineImg },
    { id: 1, name: 'Jesus', image: JesusImg },
    { id: 2, name: 'Vespera', image: VesperaImg },
    { id: 3, name: 'Wendy', image: WendyImg },
];

function Market() {
    const [experience, setExperience] = useState<number>(0);
    const [ownedSkins, setOwnedSkins] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext(); // Accedemos al usuario desde el contexto

    useEffect(() => {
        const updateFromStorage = () => {
            const storedExperience = localStorage.getItem('experience');
            const storedSkins = localStorage.getItem('ownedSkins');

            setExperience(storedExperience ? parseInt(storedExperience, 10) : 0);
            setOwnedSkins(storedSkins ? JSON.parse(storedSkins) : []);
        };

        // Cargar datos inicialmente
        updateFromStorage();

        // Escuchar cambios en localStorage
        window.addEventListener('storage', updateFromStorage);

        return () => {
            window.removeEventListener('storage', updateFromStorage);
        };
    }, []);


    const handleBuySkin = async (skinId: number) => {
        const username = localStorage.getItem('username');
        if (!username) {
            setError('No se encontró el username. Por favor, inicia sesión.');
            return;
        }

        try {
            const response = await axios.post(`http://${window.location.hostname}:3000/buyskin`, {
                username,
                idSkin: skinId,
            });

            if (response.status === 200) {
                setExperience(response.data.remainingExperience);
                setOwnedSkins(response.data.ownedSkins);
                setError(null);

                // Actualiza localStorage con los nuevos valores
                localStorage.setItem('experience', response.data.remainingExperience.toString());
                localStorage.setItem('ownedSkins', JSON.stringify(response.data.ownedSkins));
            } else {
                setError('No se pudo completar la compra.');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverMessage = err.response?.data?.message || 'Error desconocido al realizar la compra.';
                setError(serverMessage);
            } else {
                setError('Error desconocido al realizar la compra.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8">
            <h1 className="text-4xl font-bold text-center text-white mb-4">Market</h1>

            {error && (
                <div className="mb-4 bg-red-500 text-white p-2 rounded">
                    {error}
                </div>
            )}

            <div className="mb-4 text-center text-white">
                <p>Experiencia disponible: {experience} XP</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {skins.map((skin) => (
                    <div
                        key={skin.id}
                        className={`bg-white rounded-lg shadow-md p-4 flex flex-col items-center ${ownedSkins.includes(skin.id) ? 'opacity-50' : ''
                            }`}
                    >
                        <img
                            src={skin.image}
                            alt={skin.name}
                            className="w-20 h-40 object-cover mb-4"
                        />
                        <h2 className="text-lg font-bold text-gray-800 mb-2">{skin.name}</h2>
                        <p className="text-sm text-gray-600 mb-4">Precio: 100 XP</p>
                        <button
                            className={`py-2 px-4 rounded-full font-bold ${ownedSkins.includes(skin.id)
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : experience >= 100
                                    ? 'bg-blue-500 hover:bg-blue-700 text-white'
                                    : 'bg-red-500 text-white cursor-not-allowed'
                                }`}
                            onClick={() => handleBuySkin(skin.id)}
                            disabled={ownedSkins.includes(skin.id) || experience < 100}
                        >
                            {ownedSkins.includes(skin.id) ? 'Comprado' : experience >= 100 ? 'Comprar' : 'XP Insuficiente'}
                        </button>
                    </div>
                ))}
            </div>

            <Navbar currentPath={'/market'} />
        </div>
    );
}

export default Market;
