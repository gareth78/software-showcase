'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

interface Flashcard {
  id: number
  question: string
  answer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const sampleCards: Flashcard[] = [
  { id: 1, question: 'What is the time complexity of binary search?', answer: 'O(log n)', category: 'Algorithms', difficulty: 'medium' },
  { id: 2, question: 'What does HTML stand for?', answer: 'HyperText Markup Language', category: 'Web Dev', difficulty: 'easy' },
  { id: 3, question: 'What is a closure in JavaScript?', answer: 'A function that has access to variables from its outer scope even after the outer function has returned', category: 'JavaScript', difficulty: 'hard' },
  { id: 4, question: 'What is the capital of France?', answer: 'Paris', category: 'Geography', difficulty: 'easy' },
  { id: 5, question: 'Explain the CAP theorem', answer: 'A distributed system can only guarantee 2 of 3: Consistency, Availability, Partition tolerance', category: 'Systems', difficulty: 'hard' },
  { id: 6, question: 'What is React\'s Virtual DOM?', answer: 'A lightweight copy of the DOM that React uses to optimize rendering by minimizing direct DOM manipulations', category: 'React', difficulty: 'medium' },
]

const difficultyColors = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
}

export default function StudyBuddy({ onClose }: AppProps) {
  const [view, setView] = useState<'home' | 'study' | 'stats'>('home')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [studiedCards, setStudiedCards] = useState<number[]>([])

  const currentCard = sampleCards[currentIndex]

  const handleAnswer = (correct: boolean) => {
    setStudiedCards([...studiedCards, currentCard.id])

    if (correct) {
      setScore((s) => ({ ...s, correct: s.correct + 1 }))
      setStreak((s) => {
        const newStreak = s + 1
        if (newStreak > maxStreak) setMaxStreak(newStreak)
        return newStreak
      })
    } else {
      setScore((s) => ({ ...s, incorrect: s.incorrect + 1 }))
      setStreak(0)
    }

    setIsFlipped(false)
    if (currentIndex < sampleCards.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 300)
    } else {
      setTimeout(() => setView('stats'), 300)
    }
  }

  const resetStudy = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setScore({ correct: 0, incorrect: 0 })
    setStreak(0)
    setStudiedCards([])
    setView('home')
  }

  return (
    <div className="h-full flex flex-col p-4">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📚
              </motion.div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Ready to Study?</h3>
              <p className="text-sm text-white/60">Master concepts with smart flashcards</p>
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-orange-400">{sampleCards.length}</p>
                <p className="text-xs text-white/50">Cards</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{maxStreak}</p>
                <p className="text-xs text-white/50">Best Streak</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {score.correct + score.incorrect > 0
                    ? Math.round((score.correct / (score.correct + score.incorrect)) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-white/50">Accuracy</p>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-white/70 mb-3">CATEGORIES</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(sampleCards.map((c) => c.category))).map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/70"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Start button */}
            <motion.button
              className="mt-auto w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 font-bold text-white text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('study')}
            >
              Start Studying
            </motion.button>
          </motion.div>
        )}

        {view === 'study' && (
          <motion.div
            key="study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Card {currentIndex + 1} of {sampleCards.length}</span>
                <span className="text-orange-400">🔥 {streak} streak</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  animate={{ width: `${((currentIndex + 1) / sampleCards.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Category & Difficulty */}
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-sm">{currentCard.category}</span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${difficultyColors[currentCard.difficulty]}30`, color: difficultyColors[currentCard.difficulty] }}
              >
                {currentCard.difficulty}
              </span>
            </div>

            {/* Flashcard */}
            <div className="flex-1 flex items-center justify-center perspective-1000 mb-4">
              <motion.div
                className="relative w-full h-64 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 p-6 flex flex-col items-center justify-center backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-xs text-white/50 mb-4">QUESTION</p>
                  <p className="text-lg text-center text-white font-medium">{currentCard.question}</p>
                  <p className="text-xs text-white/40 mt-4">Tap to reveal answer</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/10 p-6 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <p className="text-xs text-white/50 mb-4">ANSWER</p>
                  <p className="text-lg text-center text-white font-medium">{currentCard.answer}</p>
                </div>
              </motion.div>
            </div>

            {/* Answer buttons */}
            <AnimatePresence>
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex gap-4"
                >
                  <motion.button
                    className="flex-1 py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(false)}
                  >
                    ✗ Wrong
                  </motion.button>
                  <motion.button
                    className="flex-1 py-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(true)}
                  >
                    ✓ Got It!
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isFlipped && (
              <p className="text-center text-white/40 text-sm">Tap the card to see the answer</p>
            )}
          </motion.div>
        )}

        {view === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">Session Complete!</h3>

            {/* Results */}
            <div className="w-full grid grid-cols-2 gap-4 my-6">
              <div className="bg-green-500/20 rounded-2xl p-4 text-center">
                <p className="text-4xl font-bold text-green-400">{score.correct}</p>
                <p className="text-sm text-white/60">Correct</p>
              </div>
              <div className="bg-red-500/20 rounded-2xl p-4 text-center">
                <p className="text-4xl font-bold text-red-400">{score.incorrect}</p>
                <p className="text-sm text-white/60">To Review</p>
              </div>
            </div>

            {/* Accuracy */}
            <div className="w-full bg-white/5 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">Accuracy</span>
                <span className="text-2xl font-bold text-orange-400">
                  {Math.round((score.correct / (score.correct + score.incorrect)) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(score.correct / (score.correct + score.incorrect)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Best streak */}
            <div className="flex items-center gap-2 text-lg mb-8">
              <span className="text-2xl">🔥</span>
              <span className="text-white/70">Best streak:</span>
              <span className="font-bold text-orange-400">{maxStreak}</span>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 font-bold text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetStudy}
              >
                Study Again
              </motion.button>
              <motion.button
                className="w-full py-3 rounded-xl bg-white/10 text-white/70"
                whileTap={{ scale: 0.98 }}
                onClick={resetStudy}
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
