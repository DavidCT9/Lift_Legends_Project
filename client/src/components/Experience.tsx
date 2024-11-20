import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei";
import Avatar from "./Avatar";
import { useControls } from "leva";
import { Rome } from "../components/scenario/Rome";

export const Expierence = () => {

  const { animation, character } = useControls({
    animation: {
      value: "offensiveIdle",
      options: ["offensiveIdle", "texting", "warmingUp"],
    },
    character: {
      value: "tsk",
      options: ["tsk", "wendy", "jesus", "aine", "vespera"],
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

        <Rome />

      </group>
    </>
  );
};
