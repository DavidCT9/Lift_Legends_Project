import { ContactShadows, Environment, MeshDiscardMaterial, MeshPortalMaterial, OrbitControls, Sky } from "@react-three/drei";
import Avatar from "./Avatar";
import { useControls } from "leva";

export const Expierence = () => {

    const { animation } = useControls({
        animation: {
            value: "offensiveIdle",
            options: ["offensiveIdle", "backSquat", "warmingUp", "situps"]
        }
    })

    return (
        <>
            <OrbitControls />
            <Sky />
            <Environment preset="warehouse" />
            <group position-y={-1} >
                <ContactShadows opacity={0.7} scale={10} blur={1} far={10} resolution={256} color="#000000" />

                <Avatar animation={animation} />

                <mesh scale={30} rotation-x={-Math.PI * 0.5} position-y={-0.001}>
                    <planeGeometry />
                    <meshBasicMaterial color="gray" />
                </mesh>

            </group>

        </>
    )
}

