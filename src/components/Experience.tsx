import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";

export const Expierence = () => {
    return (
        <>
            <OrbitControls />
            <Avatar />
            <ambientLight intensity={0.7} />

        </>
    )
}

