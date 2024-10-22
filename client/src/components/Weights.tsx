import { useState } from 'react';
import axios from 'axios';

import deadliftImg from './ImagesWeights/Deadlift.png';
import benchpressImg from './ImagesWeights/BenchPress.png';
import squatImg from './ImagesWeights/Squat.png';
import shoulderpressImg from './ImagesWeights/ShoulderPress.png';
import barbellrowImg from './ImagesWeights/BarbellRow.png';
import bicepcurlImg from './ImagesWeights/BicepCurl.png';
import latpulldownImg from './ImagesWeights/LatPulldown.png';
import lateralraiseImg from './ImagesWeights/LateralRaise.png';
import tricepextensionImg from './ImagesWeights/TricepExtension.png';
import legpressImg from './ImagesWeights/LegPress.png';

type Exercise = {
    name: string;
    image: string;
    width: string;
    height: string;
    difficulty: number;
};

const exercises: Exercise[] = [
    { name: 'deadlift', image: deadliftImg, width: '250px', height: '150px', difficulty: 20 },
    { name: 'benchPress', image: benchpressImg, width: '300px', height: '150px', difficulty: 20 },
    { name: 'squat', image: squatImg, width: '250px', height: '150px', difficulty: 15 },
    { name: 'shoulderPress', image: shoulderpressImg, width: '200px', height: '150px', difficulty: 25 },
    { name: 'barbellRow', image: barbellrowImg, width: '300px', height: '150px', difficulty: 18 },
    { name: 'bicepCurl', image: bicepcurlImg, width: '190px', height: '150px', difficulty: 30 },
    { name: 'latPulldown', image: latpulldownImg, width: '250px', height: '150px', difficulty: 20 },
    { name: 'lateralRaise', image: lateralraiseImg, width: '300px', height: '150px', difficulty: 35 },
    { name: 'tricepExtension', image: tricepextensionImg, width: '250px', height: '150px', difficulty: 30 },
    { name: 'legPress', image: legpressImg, width: '375px', height: '150px', difficulty: 15 },
];

function Weights() {
    const [formData, setFormData] = useState(
        exercises.reduce((acc, exercise) => {
            acc[exercise.name] = { weight: '', reps: '' };
            return acc;
        }, {} as { [key: string]: { weight: string; reps: string } })
    );

    const handleChange = (exercise: string, field: 'weight' | 'reps', value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [exercise]: { ...prevData[exercise], [field]: value },
        }));
    };

    const calculatePoints = (weight: number, reps: number, difficulty: number) => {
        return Math.round((weight * reps) / difficulty);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const username = localStorage.getItem('username');

        if (!username) {
            console.error('No se encontró el username. Asegúrate de que el usuario esté autenticado.');
            return;
        }

        for (const exercise of exercises) {
            const { weight, reps } = formData[exercise.name];
            if (weight && reps) {
                const points = calculatePoints(parseInt(weight), parseInt(reps), exercise.difficulty);

                try {
                    const response = await axios.post(`http://${window.location.hostname}:3000/updatepoints`, {
                        username: username,
                        exercise: exercise.name,
                        points: points,
                    });

                    if (response.status === 200) {
                        console.log(`Puntos para ${exercise.name} enviados con éxito.`);
                        const updatedUser = response.data.user;

                        // Verifica si la liga del usuario ha cambiado
                        const currentLeague = parseInt(localStorage.getItem('currentLeague') || '0');
                        if (updatedUser.currentLeague !== currentLeague) {
                            // Actualiza la liga en localStorage
                            localStorage.setItem('currentLeague', updatedUser.currentLeague.toString());

                            // Recarga la página para reflejar la nueva liga
                            window.location.reload();
                        }
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(`Error al enviar los puntos para ${exercise.name}:`, error.response?.data);
                    } else {
                        console.error(`Error al enviar los puntos para ${exercise.name}:`, error);
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8">
            <h1 className="text-center text-3xl font-bold mb-8">Registro de Pesos</h1>
            <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                    <div key={exercise.name} className="flex flex-col items-center space-y-2">
                        <img
                            src={exercise.image}
                            alt={exercise.name}
                            style={{ width: exercise.width, height: exercise.height }}
                            className="object-cover rounded-md"
                        />
                        <h2 className="text-lg font-semibold">{exercise.name}</h2>
                        <input
                            type="number"
                            placeholder="Peso (kg)"
                            value={formData[exercise.name].weight}
                            onChange={(e) => handleChange(exercise.name, 'weight', e.target.value)}
                            className="w-3/4 p-2 rounded bg-gray-800 text-white focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Reps"
                            value={formData[exercise.name].reps}
                            onChange={(e) => handleChange(exercise.name, 'reps', e.target.value)}
                            className="w-3/4 p-2 rounded bg-gray-800 text-white focus:outline-none"
                        />
                    </div>
                ))}
                <div className="col-span-full flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Guardar Registro
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Weights;
