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
        <div className="flex flex-col items-center justify-between min-h-screen  text-white">
            {/* Header con avatar de usuario, barra de Power Points y engranaje */}


            {/* Avatar en el centro (con tamaño ajustado) */}
            <div >
                <Canvas shadows camera={{ position: [0, 0, 6], fov: 30 }}>
                    <color attach="background" args={['#ececec']} />
                    <Expierence />  
                </Canvas>
            </div>


        </div>
    );
}

export default Home;
