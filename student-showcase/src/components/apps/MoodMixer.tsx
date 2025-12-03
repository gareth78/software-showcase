'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#fbbf24', tracks: ['Sunny Side Up', 'Walking on Sunshine', 'Good Vibes Only', 'Happy Together'] },
  { id: 'chill', emoji: '😌', label: 'Chill', color: '#60a5fa', tracks: ['Lo-Fi Dreams', 'Sunset Waves', 'Cloud Nine', 'Peaceful Mind'] },
  { id: 'energetic', emoji: '⚡', label: 'Energetic', color: '#f97316', tracks: ['Power Up', 'Run The World', 'Electric Feel', 'Unstoppable'] },
  { id: 'sad', emoji: '😢', label: 'Melancholy', color: '#8b5cf6', tracks: ['Rainy Days', 'Missing You', 'Faded Memories', 'Blue Hour'] },
  { id: 'romantic', emoji: '💕', label: 'Romantic', color: '#ec4899', tracks: ['First Kiss', 'Starlit Night', 'Forever Yours', 'Heart Flutter'] },
  { id: 'focused', emoji: '🎯', label: 'Focused', color: '#22d3ee', tracks: ['Deep Work', 'Zone In', 'Brain Boost', 'Flow State'] },
]

export default function MoodMixer({ onClose }: AppProps) {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setCurrentTrack((t) => {
              if (t !== null && selectedMood && t < selectedMood.tracks.length - 1) {
                return t + 1
              }
              setIsPlaying(false)
              return t
            })
            return 0
          }
          return p + 2
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, selectedMood])

  const handleGenerate = async () => {
    if (!selectedMood) return
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsGenerating(false)
    setCurrentTrack(0)
    setIsPlaying(true)
    setProgress(0)
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Mood Selection */}
      <AnimatePresence mode="wait">
        {!selectedMood ? (
          <motion.div
            key="mood-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <h3 className="text-lg font-display font-bold text-white mb-2">How are you feeling?</h3>
            <p className="text-sm text-white/60 mb-6">Select your mood and we'll create the perfect playlist</p>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  className="relative rounded-2xl p-4 text-left overflow-hidden group"
                  style={{ backgroundColor: `${mood.color}15` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMood(mood)}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${mood.color}30, transparent)` }}
                  />
                  <span className="text-3xl mb-2 block">{mood.emoji}</span>
                  <span className="text-white font-medium">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : !isGenerating && currentTrack === null ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-6"
              style={{ backgroundColor: `${selectedMood.color}30` }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {selectedMood.emoji}
            </motion.div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Feeling {selectedMood.label}
            </h3>
            <p className="text-sm text-white/60 mb-8 text-center">
              Ready to generate your perfect playlist?
            </p>
            <motion.button
              className="px-8 py-3 rounded-full font-bold text-white"
              style={{ backgroundColor: selectedMood.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
            >
              Generate Playlist
            </motion.button>
            <button
              className="mt-4 text-sm text-white/50"
              onClick={() => setSelectedMood(null)}
            >
              Change mood
            </button>
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              className="w-24 h-24 rounded-full border-4 border-white/20 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="mt-6 text-white/70">Mixing your vibe...</p>

            {/* Animated bars */}
            <div className="flex gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 rounded-full"
                  style={{ backgroundColor: selectedMood?.color }}
                  animate={{
                    height: [20, 40, 20],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="playlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Now Playing */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ backgroundColor: `${selectedMood.color}20` }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${selectedMood.color}30` }}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                >
                  {selectedMood.emoji}
                </motion.div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 mb-1">NOW PLAYING</p>
                  <p className="font-bold text-white">
                    {currentTrack !== null && selectedMood.tracks[currentTrack]}
                  </p>
                  <p className="text-sm text-white/60">{selectedMood.label} Mix</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: selectedMood.color, width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-6 mt-4">
                <motion.button
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (currentTrack !== null && currentTrack > 0) {
                      setCurrentTrack(currentTrack - 1)
                      setProgress(0)
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </motion.button>

                <motion.button
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedMood.color }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </motion.button>

                <motion.button
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (currentTrack !== null && currentTrack < selectedMood.tracks.length - 1) {
                      setCurrentTrack(currentTrack + 1)
                      setProgress(0)
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Playlist */}
            <div className="flex-1 overflow-auto no-scrollbar">
              <h4 className="text-sm font-bold text-white/70 mb-3">UP NEXT</h4>
              {selectedMood.tracks.map((track, index) => (
                <motion.button
                  key={track}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left ${
                    currentTrack === index ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentTrack(index)
                    setProgress(0)
                    setIsPlaying(true)
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: currentTrack === index ? selectedMood.color : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {currentTrack === index && isPlaying ? (
                      <motion.div className="flex gap-0.5">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: [8, 16, 8] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${currentTrack === index ? 'text-white' : 'text-white/70'}`}>
                      {track}
                    </p>
                    <p className="text-xs text-white/40">3:{Math.floor(Math.random() * 40 + 10)}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Visualizer */}
            <div className="flex justify-center gap-1 py-4 border-t border-white/10 mt-4">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ backgroundColor: selectedMood.color }}
                  animate={{
                    height: isPlaying ? [4, Math.random() * 30 + 10, 4] : 4,
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
