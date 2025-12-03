'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

interface PetState {
  name: string
  hunger: number
  happiness: number
  energy: number
  level: number
  xp: number
  coins: number
}

const petEmojis = ['🐱', '🐶', '🐰', '🐹', '🦊', '🐻']
const foodItems = [
  { id: 'apple', emoji: '🍎', hunger: 15, cost: 5 },
  { id: 'pizza', emoji: '🍕', hunger: 30, cost: 10 },
  { id: 'cake', emoji: '🍰', hunger: 50, cost: 20 },
]
const playItems = [
  { id: 'ball', emoji: '⚽', happiness: 20, energy: -10 },
  { id: 'music', emoji: '🎵', happiness: 15, energy: -5 },
  { id: 'dance', emoji: '💃', happiness: 30, energy: -20 },
]

export default function PixelPets({ onClose }: AppProps) {
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [view, setView] = useState<'select' | 'main' | 'shop' | 'play'>('select')
  const [pet, setPet] = useState<PetState>({
    name: '',
    hunger: 70,
    happiness: 70,
    energy: 100,
    level: 1,
    xp: 0,
    coins: 50,
  })
  const [action, setAction] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')

  // Decrease stats over time
  useEffect(() => {
    if (view !== 'main' && view !== 'shop' && view !== 'play') return

    const interval = setInterval(() => {
      setPet((p) => ({
        ...p,
        hunger: Math.max(0, p.hunger - 1),
        happiness: Math.max(0, p.happiness - 0.5),
        energy: Math.min(100, p.energy + 0.5),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [view])

  // Check level up
  useEffect(() => {
    if (pet.xp >= pet.level * 100) {
      setPet((p) => ({
        ...p,
        level: p.level + 1,
        xp: 0,
        coins: p.coins + 25,
      }))
      showMessage('🎉 Level Up!')
    }
  }, [pet.xp, pet.level])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleFeed = (food: typeof foodItems[0]) => {
    if (pet.coins < food.cost) {
      showMessage('Not enough coins!')
      return
    }
    setAction('eating')
    setPet((p) => ({
      ...p,
      hunger: Math.min(100, p.hunger + food.hunger),
      coins: p.coins - food.cost,
      xp: p.xp + 10,
    }))
    showMessage(`Yum! +${food.hunger} hunger`)
    setTimeout(() => setAction(null), 1000)
  }

  const handlePlay = (activity: typeof playItems[0]) => {
    if (pet.energy < Math.abs(activity.energy)) {
      showMessage('Too tired to play!')
      return
    }
    setAction('playing')
    setPet((p) => ({
      ...p,
      happiness: Math.min(100, p.happiness + activity.happiness),
      energy: Math.max(0, p.energy + activity.energy),
      xp: p.xp + 15,
      coins: p.coins + 5,
    }))
    showMessage(`Fun! +${activity.happiness} happiness`)
    setTimeout(() => setAction(null), 1000)
  }

  const handleSleep = () => {
    setAction('sleeping')
    showMessage('Zzz... Resting...')
    setTimeout(() => {
      setPet((p) => ({
        ...p,
        energy: 100,
        xp: p.xp + 5,
      }))
      setAction(null)
      showMessage('Fully rested!')
    }, 2000)
  }

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col p-4">
      <AnimatePresence mode="wait">
        {view === 'select' ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <h3 className="text-xl font-display font-bold text-white mb-2">Choose Your Pet!</h3>
            <p className="text-sm text-white/60 mb-8">Pick a friend to take care of</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {petEmojis.map((emoji, i) => (
                <motion.button
                  key={emoji}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${
                    selectedPet === emoji ? 'bg-green-500/30 ring-2 ring-green-400' : 'bg-white/10'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPet(emoji)}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>

            {selectedPet && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <input
                  type="text"
                  placeholder="Name your pet..."
                  className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 mb-4 outline-none focus:ring-2 ring-green-400"
                  maxLength={12}
                  onChange={(e) => setPet((p) => ({ ...p, name: e.target.value }))}
                />
                <motion.button
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-cyan-500 font-bold text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => pet.name && setView('main')}
                >
                  Start Adventure!
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-white">{pet.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-400">Lv.{pet.level}</span>
                  <span className="text-white/40">|</span>
                  <span className="text-yellow-400">🪙 {pet.coins}</span>
                </div>
              </div>
              <div className="text-xs text-white/50">
                XP: {pet.xp}/{pet.level * 100}
              </div>
            </div>

            {/* Pet Display */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <motion.div
                className="w-40 h-40 rounded-full bg-gradient-to-br from-green-400/20 to-cyan-500/20 flex items-center justify-center mb-4"
                animate={{
                  scale: action === 'eating' ? [1, 1.2, 1] : action === 'playing' ? [1, 1.1, 0.9, 1.1, 1] : action === 'sleeping' ? [1, 0.95, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: action === 'sleeping' ? Infinity : 0 }}
              >
                <motion.span
                  className="text-7xl"
                  animate={{
                    rotate: action === 'playing' ? [0, -10, 10, 0] : 0,
                    y: action === 'sleeping' ? [0, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.5, repeat: action ? Infinity : 0 }}
                >
                  {selectedPet}
                </motion.span>
              </motion.div>

              {/* Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-4 bg-white/20 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action indicator */}
              {action === 'sleeping' && (
                <motion.div
                  className="absolute text-2xl"
                  initial={{ opacity: 0, x: 60, y: -40 }}
                  animate={{ opacity: [0, 1, 0], y: [-40, -80], x: [60, 80] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💤
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <StatBar label="🍖 Hunger" value={pet.hunger} color="#22c55e" />
              <StatBar label="💖 Happiness" value={pet.happiness} color="#ec4899" />
              <StatBar label="⚡ Energy" value={pet.energy} color="#f59e0b" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-2">
              <motion.button
                className="flex flex-col items-center gap-1 bg-white/10 rounded-xl py-3"
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('shop')}
              >
                <span className="text-2xl">🍎</span>
                <span className="text-xs text-white/60">Feed</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-1 bg-white/10 rounded-xl py-3"
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('play')}
              >
                <span className="text-2xl">🎮</span>
                <span className="text-xs text-white/60">Play</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-1 bg-white/10 rounded-xl py-3"
                whileTap={{ scale: 0.95 }}
                onClick={handleSleep}
              >
                <span className="text-2xl">😴</span>
                <span className="text-xs text-white/60">Sleep</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-1 bg-white/10 rounded-xl py-3"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPet((p) => ({ ...p, xp: p.xp + 5 }))
                  showMessage('Good pet! +5 XP')
                }}
              >
                <span className="text-2xl">🤗</span>
                <span className="text-xs text-white/60">Pet</span>
              </motion.button>
            </div>

            {/* Shop/Play Modals */}
            <AnimatePresence>
              {view === 'shop' && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="absolute inset-x-4 bottom-4 bg-[#1a1a2e] rounded-2xl p-4 shadow-xl border border-white/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold">Food Shop</h4>
                    <button onClick={() => setView('main')} className="text-white/50">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {foodItems.map((food) => (
                      <motion.button
                        key={food.id}
                        className="bg-white/10 rounded-xl p-3 flex flex-col items-center"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFeed(food)}
                      >
                        <span className="text-3xl mb-1">{food.emoji}</span>
                        <span className="text-xs text-green-400">+{food.hunger}</span>
                        <span className="text-xs text-yellow-400">🪙{food.cost}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {view === 'play' && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="absolute inset-x-4 bottom-4 bg-[#1a1a2e] rounded-2xl p-4 shadow-xl border border-white/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold">Activities</h4>
                    <button onClick={() => setView('main')} className="text-white/50">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {playItems.map((activity) => (
                      <motion.button
                        key={activity.id}
                        className="bg-white/10 rounded-xl p-3 flex flex-col items-center"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlay(activity)}
                      >
                        <span className="text-3xl mb-1">{activity.emoji}</span>
                        <span className="text-xs text-pink-400">+{activity.happiness} 💖</span>
                        <span className="text-xs text-orange-400">{activity.energy} ⚡</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
