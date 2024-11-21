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
import ExerciseForm from './ExerciseForm'
import {Navbar} from './Navbar';


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
        e.preventDefault(); // Make sure this is called
        const username = localStorage.getItem('username');

        if (!username) {
            console.error('No user was found. Please ensure the user is authenticated.');
            return;
        }

        // Validate that at least one exercise has data
        const hasData = Object.values(formData).some(({ weight, reps }) => weight && reps);
        if (!hasData) {
            alert('At least register one exercise, please.');
            return;
        }

        let allSuccessful = true;

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
                    allSuccessful = false;
                    if (axios.isAxiosError(error)) {
                        console.error(`Error al enviar los puntos para ${exercise.name}:`, error.response?.data);
                    } else {
                        console.error(`Error al enviar los puntos para ${exercise.name}:`, error);
                    }
                }
            }
        }

        if (allSuccessful) {
            alert('Todos los datos se han registrado correctamente.');
        } else {
            alert('Hubo un error en algunos registros. Por favor, verifica la consola para más detalles.');
        }
    };

    return (
        <div className="min-h-screen text-white p-8">
        <h1 className="text-center text-3xl font-bold mb-8">WEIGHTS REGISTER</h1>
        {/* Wrap only the submit button in a form */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => (
                <ExerciseForm
                    key={exercise.name}
                    exercise={exercise}
                    formData={formData[exercise.name]}
                    onChange={(field, value) => handleChange(exercise.name, field, value)}
                />
            ))}
        </div>
        <div className="flex justify-center mt-6 mb-24">
            <form onSubmit={handleSubmit}>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Save Register
                </button>
            </form>
        </div>

        <Navbar currentPath={'/weights'}/>
    </div>
    );
}

export default Weights;
