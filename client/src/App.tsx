import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Weights from './components/Weights';
import Leagues from './components/Leagues';
import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import Market from './components/Market';
import AuthContextProvider from './components/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Weights" element={<Weights />} />
          <Route path="/Leagues" element={<Leagues />} />
          <Route path="/Market" element={<Market />} />
          <Route path="/avatar" element={
            <Canvas shadows camera={{ position: [0, 0, 6], fov: 30 }} >
              <color attach='background' args={['#ececec']} />
              <Experience />

            </Canvas>
          } />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}
export default App
