'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Carousel from '@/components/ui/Carousel'
import AppModal from '@/components/ui/AppModal'
import BackgroundParticles from '@/components/ui/BackgroundParticles'
import { projects } from '@/lib/projects'
import { Project } from '@/lib/types'

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <main className="min-h-screen min-h-[100dvh] flex flex-col overflow-hidden relative">
      <BackgroundParticles />

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a14]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
                animate={{
                  rotate: [0, 180, 360],
                  borderRadius: ['20%', '50%', '20%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            <motion.p
              className="mt-8 text-white/60 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Loading student projects...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 pt-12 pb-4 text-center safe-area-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -20 : 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🚀
          </motion.span>
          <span className="text-xs text-white/70">Built with AI Assistance</span>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Student AI Projects
        </motion.h1>

        <motion.p
          className="text-sm md:text-base text-white/60 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Discover amazing apps created by students with AI assistance.
          Swipe to explore, tap to interact.
        </motion.p>
      </motion.header>

      {/* Carousel section */}
      <motion.div
        className="flex-1 flex flex-col justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ delay: 0.5 }}
      >
        <Carousel projects={projects} onProjectSelect={handleProjectSelect} />
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 px-6 pb-8 text-center safe-area-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {projects.slice(0, 5).map((project, i) => (
              <motion.div
                key={project.id}
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${project.gradient} flex items-center justify-center text-sm border-2 border-[#0a0a14]`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                {project.icon}
              </motion.div>
            ))}
          </div>
          <span className="text-sm text-white/40">
            {projects.length} projects from amazing students
          </span>
        </div>

        <motion.p
          className="text-xs text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Made with ♥ and AI • {new Date().getFullYear()}
        </motion.p>
      </motion.footer>

      {/* App Modal */}
      <AppModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  )
}
