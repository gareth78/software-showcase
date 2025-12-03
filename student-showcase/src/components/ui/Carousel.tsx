'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { Project } from '@/lib/types'

interface CarouselProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
}

export default function Carousel({ projects, onProjectSelect }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const CARD_WIDTH = 280
  const CARD_GAP = 20

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    const velocity = info.velocity.x
    const offset = info.offset.x

    if (offset < -threshold || velocity < -500) {
      setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1))
    } else if (offset > threshold || velocity > 500) {
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }

    setTimeout(() => setIsDragging(false), 100)
  }, [projects.length])

  const handleCardClick = useCallback((index: number, project: Project) => {
    if (isDragging) return

    if (index === activeIndex) {
      onProjectSelect(project)
    } else {
      setActiveIndex(index)
    }
  }, [activeIndex, isDragging, onProjectSelect])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1))
      } else if (e.key === 'Enter') {
        onProjectSelect(projects[activeIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, projects, onProjectSelect])

  const dragConstraints = {
    left: -((projects.length - 1) * (CARD_WIDTH + CARD_GAP)),
    right: 0,
  }

  return (
    <div className="relative w-full overflow-hidden py-8" ref={containerRef}>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {projects.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-white/30'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveIndex(index)}
            animate={{
              width: index === activeIndex ? 24 : 8,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Cards container */}
      <motion.div
        className="flex gap-5 px-[calc(50vw-140px)] cursor-grab active:cursor-grabbing touch-pan-x"
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={{
          x: -(activeIndex * (CARD_WIDTH + CARD_GAP)),
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isActive={index === activeIndex}
            onClick={() => handleCardClick(index, project)}
          />
        ))}
      </motion.div>

      {/* Navigation arrows (desktop) */}
      <div className="hidden md:flex absolute top-1/2 left-4 right-4 -translate-y-1/2 justify-between pointer-events-none">
        <motion.button
          className={`w-12 h-12 rounded-full glass flex items-center justify-center pointer-events-auto ${
            activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
          }`}
          whileHover={{ scale: activeIndex === 0 ? 1 : 1.1 }}
          whileTap={{ scale: activeIndex === 0 ? 1 : 0.95 }}
          onClick={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          className={`w-12 h-12 rounded-full glass flex items-center justify-center pointer-events-auto ${
            activeIndex === projects.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
          }`}
          whileHover={{ scale: activeIndex === projects.length - 1 ? 1 : 1.1 }}
          whileTap={{ scale: activeIndex === projects.length - 1 ? 1 : 0.95 }}
          onClick={() => activeIndex < projects.length - 1 && setActiveIndex(activeIndex + 1)}
          disabled={activeIndex === projects.length - 1}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Swipe hint (mobile) */}
      <motion.p
        className="text-center text-white/40 text-sm mt-6 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Swipe to explore more projects
      </motion.p>
    </div>
  )
}
