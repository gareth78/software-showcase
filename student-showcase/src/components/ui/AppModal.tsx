'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/lib/types'
import dynamic from 'next/dynamic'

// Dynamically import app components
const MoodMixer = dynamic(() => import('../apps/MoodMixer'), { ssr: false })
const PixelPets = dynamic(() => import('../apps/PixelPets'), { ssr: false })
const StudyBuddy = dynamic(() => import('../apps/StudyBuddy'), { ssr: false })
const BudgetBoba = dynamic(() => import('../apps/BudgetBoba'), { ssr: false })
const VibeCam = dynamic(() => import('../apps/VibeCam'), { ssr: false })
const CodePoetry = dynamic(() => import('../apps/CodePoetry'), { ssr: false })
const GroupSync = dynamic(() => import('../apps/GroupSync'), { ssr: false })
const NeuralDoodle = dynamic(() => import('../apps/NeuralDoodle'), { ssr: false })

interface AppModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

const appComponents: Record<string, React.ComponentType<{ onClose: () => void }>> = {
  moodmixer: MoodMixer,
  pixelpets: PixelPets,
  studybuddy: StudyBuddy,
  budgetboba: BudgetBoba,
  vibecam: VibeCam,
  codepoetry: CodePoetry,
  groupsync: GroupSync,
  neuraldoodle: NeuralDoodle,
}

export default function AppModal({ project, isOpen, onClose }: AppModalProps) {
  if (!project) return null

  const AppComponent = appComponents[project.id]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md h-[85vh] max-h-[700px] rounded-3xl overflow-hidden pointer-events-auto"
              initial={{ scale: 0.8, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* App background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
              <div className="absolute inset-0 bg-[#0f0f1a]" />

              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full glass flex items-center justify-center text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* App header */}
              <div className="relative z-10 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.icon}</span>
                  <div>
                    <h2 className="font-display font-bold text-white">{project.name}</h2>
                    <p className="text-xs text-white/50">by {project.creator}</p>
                  </div>
                </div>
              </div>

              {/* App content */}
              <div className="relative z-10 h-[calc(100%-72px)] overflow-auto no-scrollbar">
                {AppComponent && <AppComponent onClose={onClose} />}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
