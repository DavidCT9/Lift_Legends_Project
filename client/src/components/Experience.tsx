import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import Avatar from "./Avatar";
import { useControls } from "leva";

export const Expierence = () => {

  const { animation, character } = useControls({
    animation: {
      value: "offensiveIdle",
      options: ["offensiveIdle", "texting", "warmingUp"],
    },
    character: {
      value: "wendy",
      options: ["tsk", "wendy"],
    },
  });

  return (
    <>
      <OrbitControls />
      <Sky />
      <Environment preset="warehouse" />
      <group position-y={-1}>
        <ContactShadows opacity={0.7} scale={10} blur={1} far={10} resolution={256} color="#000000" />

        {/* Force re-mount of Avatar by setting the key prop */}
        <Avatar key={character} animation={animation} characterName={character} />

        <mesh scale={30} rotation-x={-Math.PI * 0.5} position-y={-0.001}>
          <planeGeometry />
          <meshBasicMaterial color="gray" />
        </mesh>
      </group>
    </>
  );
};
