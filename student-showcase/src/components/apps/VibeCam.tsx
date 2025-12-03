'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

const filters = [
  { id: 'none', name: 'Normal', emoji: '📷', css: '', vibeText: '' },
  { id: 'main-character', name: 'Main Character', emoji: '✨', css: 'saturate-150 contrast-110 brightness-110', vibeText: 'protagonist energy detected' },
  { id: 'corporate', name: 'Corporate Dystopia', emoji: '💼', css: 'grayscale sepia-[.3] contrast-125', vibeText: 'hustle culture activated' },
  { id: 'nostalgia', name: '2014 Tumblr', emoji: '🌸', css: 'sepia-[.2] contrast-90 brightness-90 saturate-110', vibeText: 'indie aesthetic unlocked' },
  { id: 'chaotic', name: 'Chaotic Good', emoji: '🌈', css: 'hue-rotate-180 saturate-200', vibeText: 'unhinged energy detected' },
  { id: 'villain', name: 'Villain Arc', emoji: '🖤', css: 'contrast-150 brightness-75 saturate-50', vibeText: 'origin story loading...' },
  { id: 'dreamy', name: 'Dreamcore', emoji: '☁️', css: 'blur-[0.5px] brightness-125 contrast-90', vibeText: 'liminal space entered' },
  { id: 'retro', name: 'Y2K Baby', emoji: '💿', css: 'hue-rotate-[330deg] saturate-150 contrast-110', vibeText: 'low-rise jeans energy' },
]

const sampleImages = [
  '🏙️', '🌅', '🎭', '🪴', '☕', '🎸'
]

export default function VibeCam({ onClose }: AppProps) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0])
  const [currentImage, setCurrentImage] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState<{filter: typeof filters[0], image: string}[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [vibeLevel, setVibeLevel] = useState(0)

  useEffect(() => {
    if (selectedFilter.id !== 'none') {
      const interval = setInterval(() => {
        setVibeLevel((v) => (v >= 100 ? 100 : v + 10))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setVibeLevel(0)
    }
  }, [selectedFilter])

  const handleCapture = () => {
    setIsCapturing(true)
    setTimeout(() => {
      setCapturedPhotos([
        { filter: selectedFilter, image: sampleImages[currentImage] },
        ...capturedPhotos,
      ])
      setIsCapturing(false)
    }, 500)
  }

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!showGallery ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Viewfinder */}
            <div className="relative flex-1 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 overflow-hidden">
              {/* Image preview */}
              <motion.div
                className={`absolute inset-0 flex items-center justify-center ${selectedFilter.css}`}
                animate={{
                  scale: isCapturing ? [1, 1.1, 1] : 1,
                }}
              >
                <span className="text-[120px]">{sampleImages[currentImage]}</span>
              </motion.div>

              {/* Flash effect */}
              <AnimatePresence>
                {isCapturing && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Vibe text overlay */}
              {selectedFilter.vibeText && (
                <motion.div
                  className="absolute top-4 left-0 right-0 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedFilter.id}
                >
                  <span className="px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
                    {selectedFilter.vibeText}
                  </span>
                </motion.div>
              )}

              {/* Vibe meter */}
              {selectedFilter.id !== 'none' && (
                <div className="absolute top-16 left-4 right-4">
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>VIBE CHECK</span>
                    <span>{vibeLevel}%</span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      animate={{ width: `${vibeLevel}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Filter name */}
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
                  {selectedFilter.emoji} {selectedFilter.name}
                </span>
              </div>

              {/* Gallery button */}
              <motion.button
                className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowGallery(true)}
              >
                <span className="text-xl">🖼️</span>
                {capturedPhotos.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-xs flex items-center justify-center">
                    {capturedPhotos.length}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Controls */}
            <div className="p-4 bg-[#0f0f1a]">
              {/* Image selector */}
              <div className="flex justify-center gap-2 mb-4">
                {sampleImages.map((img, index) => (
                  <motion.button
                    key={index}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentImage === index ? 'bg-purple-500/30 ring-2 ring-purple-400' : 'bg-white/10'
                    }`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentImage(index)}
                  >
                    <span>{img}</span>
                  </motion.button>
                ))}
              </div>

              {/* Capture button */}
              <div className="flex justify-center mb-4">
                <motion.button
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCapture}
                >
                  <div className="w-full h-full rounded-full bg-[#0f0f1a] flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600" />
                  </div>
                </motion.button>
              </div>

              {/* Filter selector */}
              <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
                <div className="flex gap-2">
                  {filters.map((filter) => (
                    <motion.button
                      key={filter.id}
                      className={`flex-shrink-0 px-4 py-2 rounded-full ${
                        selectedFilter.id === filter.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                          : 'bg-white/10'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedFilter(filter)
                        setVibeLevel(0)
                      }}
                    >
                      <span className="mr-1">{filter.emoji}</span>
                      <span className="text-sm">{filter.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="flex-1 flex flex-col p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Gallery</h3>
              <button onClick={() => setShowGallery(false)} className="text-white/50">✕</button>
            </div>

            {capturedPhotos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4">📸</span>
                <p className="text-white/60">No photos yet!</p>
                <p className="text-sm text-white/40">Take some pics to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-auto">
                {capturedPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-indigo-900/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`absolute inset-0 flex items-center justify-center ${photo.filter.css}`}>
                      <span className="text-5xl">{photo.image}</span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/50 text-xs">
                        {photo.filter.emoji} {photo.filter.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
