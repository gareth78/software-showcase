'use client'

import { motion } from 'framer-motion'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
  index: number
  isActive: boolean
  onClick: () => void
}

export default function ProjectCard({ project, index, isActive, onClick }: ProjectCardProps) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[280px] h-[380px] cursor-pointer select-none"
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? 1.05 : 0.95,
        filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        scale: { duration: 0.3 },
        filter: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Card background with gradient */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${project.gradient} opacity-90`}
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-3xl glass-dark" />

      {/* Glow effect for active card */}
      {isActive && (
        <motion.div
          className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${project.gradient} blur-xl opacity-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col z-10">
        {/* Category badge */}
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
            {project.category}
          </span>
          <motion.span
            className="text-3xl"
            animate={{
              rotate: isActive ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: isActive ? Infinity : 0,
              repeatDelay: 2,
            }}
          >
            {project.icon}
          </motion.span>
        </div>

        {/* App name and creator */}
        <div className="mt-auto">
          <motion.h3
            className="text-2xl font-display font-bold text-white mb-1"
            animate={{ x: isActive ? [0, 2, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.name}
          </motion.h3>

          {/* Creator info */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: project.accentColor }}
            >
              {project.creatorAvatar}
            </div>
            <span className="text-sm text-white/80">{project.creator}</span>
          </div>

          <p className="text-sm text-white/70 line-clamp-2 mb-4">
            {project.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tap indicator */}
        <motion.div
          className="absolute bottom-4 right-4 flex items-center gap-1 text-white/50 text-xs"
          animate={{
            opacity: isActive ? [0.5, 1, 0.5] : 0.3,
            scale: isActive ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <span>Tap to explore</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
