'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, X } from 'lucide-react'

interface Exercise {
  name: string
  image: string
  width: string
  height: string
  difficulty: number
}

interface ExerciseFormProps {
  exercise: Exercise
  formData: { weight: string; reps: string }
  onChange: (field: 'weight' | 'reps', value: string) => void
}

export default function ExerciseForm({ exercise, formData, onChange }: ExerciseFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const calculateProgress = () => {
    const weight = parseInt(formData.weight) || 0
    const reps = parseInt(formData.reps) || 0
    return Math.min((weight * reps) / (exercise.difficulty * 100), 1)
  }

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Stop event bubbling
    setIsExpanded(!isExpanded)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'weight' | 'reps') => {
    e.stopPropagation() // Stop event bubbling
    onChange(field, e.target.value)
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"> {/* Changed from motion.div to regular div for form handling */}
      <div className="relative">
        <motion.img
          src={exercise.image}
          alt={exercise.name}
          style={{ width: exercise.width, height: exercise.height }}
          className="w-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
          <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
        </div>
        <motion.button
          type="button" // Explicitly set button type
          className="absolute top-2 right-2 bg-gray-800 p-2 rounded-full text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExpandToggle}
        >
          {isExpanded ? <X size={20} /> : <Dumbbell size={20} />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 space-y-4"
          >
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor={`${exercise.name}-weight`} className="block text-sm font-medium text-gray-400 mb-1">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    id={`${exercise.name}-weight`}
                    type="number"
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange(e, 'weight')}
                    className="w-full p-2 pl-8 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor={`${exercise.name}-reps`} className="block text-sm font-medium text-gray-400 mb-1">
                  Reps
                </label>
                <div className="relative">
                  <input
                    id={`${exercise.name}-reps`}
                    type="number"
                    placeholder="Reps"
                    value={formData.reps}
                    onChange={(e) => handleInputChange(e, 'reps')}
                    className="w-full p-2 pl-8 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-gray-400">Difficulty: {exercise.difficulty}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress() * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}