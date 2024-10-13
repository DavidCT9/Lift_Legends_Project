import { useState } from 'react';

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


const exercises = [
    { name: 'Deadlift', image: deadliftImg, width: '250px', height: '150px' },
    { name: 'BenchPress', image: benchpressImg, width: '300px', height: '150px' },
    { name: 'Squat', image: squatImg, width: '250px', height: '150px' },
    { name: 'ShoulderPress', image: shoulderpressImg, width: '200px', height: '150px' },
    { name: 'BarbellRow', image: barbellrowImg, width: '300px', height: '150px' },
    { name: 'BicepCurl', image: bicepcurlImg, width: '190px', height: '150px' },
    { name: 'LatPulldown', image: latpulldownImg, width: '250px', height: '150px' },
    { name: 'LateralRaise', image: lateralraiseImg, width: '300px', height: '150px' },
    { name: 'TricepExtension', image: tricepextensionImg, width: '250px', height: '150px' },
    { name: 'LegPress', image: legpressImg, width: '375px', height: '150px' },
];

function Weights() {
    const [formData, setFormData] = useState(
        exercises.reduce((acc, exercise) => {
            acc[exercise.name] = { weight: '', reps: '' };
            return acc;
        }, {})
    );

    const handleChange = (exercise, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [exercise]: { ...prevData[exercise], [field]: value },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // Aquí se enviará al backend más adelante
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-center text-3xl font-bold mb-8">Registro de Pesos</h1>
            <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                    <div key={exercise.name} className="flex flex-col items-center space-y-2">
                        {/* Imagen del ejercicio */}
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
                            onChange={(e) =>
                                handleChange(exercise.name, 'weight', e.target.value)
                            }
                            className="w-3/4 p-2 rounded bg-gray-800 text-white focus:outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Reps"
                            value={formData[exercise.name].reps}
                            onChange={(e) =>
                                handleChange(exercise.name, 'reps', e.target.value)
                            }
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
