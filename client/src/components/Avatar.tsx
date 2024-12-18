
import React, { useEffect, useRef } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import Tsk from '../components/characters/Tsk'
import Wendy from '../components/characters/Wendy'
import Jesus from '../components/characters/Jesus'
import Aine from '../components/characters/Aine'
import Vespera from '../components/characters/Vespera';



interface AvatarProps {
  animation: string;
  characterName: string;
}

let characterName = '';

export default function Avatar(props: AvatarProps) {
  const { animation } = props;
  characterName = props.characterName;

  let avatarComponents = null;

  if (characterName === 'tsk') {
    avatarComponents = <Tsk />;
  } else if (characterName == 'wendy') {
    avatarComponents = <Wendy />
  } else if (characterName == 'jesus') {
    avatarComponents = <Jesus />
  } else if (characterName == 'aine') {
    avatarComponents = <Aine />
  } else if (characterName == 'vespera') {
    avatarComponents = <Vespera />
  }

  const group = useRef<Group>(null); //  modification to: const group = useRef();

  const { headFollow, cursorFollow } = useControls({
    headFollow: false,
    cursorFollow: false
  })  

  const { animations: offensiveIdle } = useFBX("animations/" + characterName + "/OffensiveIdle.fbx")
  const { animations: texting } = useFBX("animations/" + characterName + "/TextingWhileStanding.fbx")
  const { animations: warmingUp } = useFBX("animations/" + characterName + "/WarmingUp.fbx")

  offensiveIdle[0].name = "offensiveIdle";
  texting[0].name = "texting";
  warmingUp[0].name = "warmingUp";

  const { actions } = useAnimations([offensiveIdle[0], texting[0], warmingUp[0]], group);

  useEffect(() => {
    if (actions[animation]) {
      // Only fade in if the animation is not already playing
      if (!actions[animation].isRunning()) {
        actions[animation].fadeIn(0.5).play();
      }
    }

    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5);
      }
    };
  }, [animation, actions]);

  useFrame((state) => {
    if (headFollow) {
      group.current?.getObjectByName("Head")?.lookAt(state.camera.position);
    }
    if (cursorFollow) {
      const cursorTarget = new THREE.Vector3(state.pointer.x, state.pointer.y, 2)
      group.current?.getObjectByName("Spine2")?.lookAt(cursorTarget);
    }
  });

  return (
    <group {...props} ref={group} dispose={null} >
      {avatarComponents}
    </group>
  )
}

useGLTF.preload('models/' + characterName + '/' + characterName + '.glb')