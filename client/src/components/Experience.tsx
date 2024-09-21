import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";

export const Expierence = () => {
    return (
        <>
            <OrbitControls />

            <group position-y={-1} position-z={1}>
                <Avatar />
            </group>
            <ambientLight intensity={1} />

        </>
    )
}

