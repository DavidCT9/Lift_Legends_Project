import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { Canvas } from '@react-three/fiber'
import { Expierence } from './components/Experience'

/*function App() {

  return (
    <Canvas shadows camera={{ position: [0, 0, 6], fov: 30}} >
      <color attach='background' args={['#ececec']} />
      <Expierence/>

    </Canvas>

  )
}*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/avatar" element={
          <Canvas shadows camera={{ position: [0, 0, 6], fov: 30 }} >
            <color attach='background' args={['#ececec']} />
            <Expierence />

          </Canvas>
        } />
      </Routes>
    </Router>
  );
}
export default App
