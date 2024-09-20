import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { Expierence } from './components/Experience'

function App() {

  return (
    <Canvas shadows camera={{ position: [0, 5, 2], fov: 30}}>
      <color attach='background' args={['#ececec']} />
      <Expierence />

    </Canvas>

  )
}

export default App
