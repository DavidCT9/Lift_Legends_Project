"use client"

import { ContactShadows, Environment, OrbitControls, Sky } from "@react-three/drei"
import { useEffect, useState, useCallback } from "react"
import { useControls, button } from "leva"
import Avatar from "./Avatar"
import { Rome } from "../components/scenario/Rome"

type Skin = {
  id: number
  name: string
}

const skins: Skin[] = [
  { id: 0, name: "tsk" },
  { id: 1, name: "aine" },
  { id: 2, name: "jesus" },
  { id: 3, name: "vespera" },
  { id: 4, name: "wendy" },
]

const DEFAULT_SKIN = "tsk"

export const Experience = () => {
  const [availableSkins, setAvailableSkins] = useState<string[]>([DEFAULT_SKIN])
  const [currentSkin, setCurrentSkin] = useState<string>(DEFAULT_SKIN)

  const loadAvailableSkins = useCallback(() => {
    const storedSkins = localStorage.getItem("ownedSkins")
    if (storedSkins) {
      try {
        const ownedSkinIds = JSON.parse(storedSkins)
        const ownedSkinNames = skins
          .filter((skin) => ownedSkinIds.includes(skin.id))
          .map((skin) => skin.name)
        setAvailableSkins([ ...ownedSkinNames])
      } catch (error) {
        console.error("Error parsing ownedSkins:", error)
        setAvailableSkins([DEFAULT_SKIN])
      }
    } else {
      setAvailableSkins([DEFAULT_SKIN])
    }
    setCurrentSkin(DEFAULT_SKIN)
  }, [])

  useEffect(() => {
    loadAvailableSkins()

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "ownedSkins") {
        loadAvailableSkins()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadAvailableSkins])

  const controls = useControls(
    {
      animation: {
        value: "offensiveIdle",
        options: ["offensiveIdle", "texting", "warmingUp"],
      },
      character: {
        value: currentSkin,
        options: availableSkins,
        onChange: (value) => {
          if (availableSkins.includes(value)) {
            setCurrentSkin(value)
          }
        },
      },
    },
    [availableSkins, currentSkin]
  )

  return (
    <>
      <OrbitControls />
      <Sky />
      <Environment preset="warehouse" />
      <group position-y={-1}>
        <ContactShadows
          opacity={0.7}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Avatar
          key={currentSkin}
          animation={controls.animation}
          characterName={currentSkin}
        />
        <Rome />
      </group>
    </>
  )
}

