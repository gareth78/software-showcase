'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

const sampleCode = [
  {
    code: `function findLove() {
  while (searching) {
    if (found) return happiness;
    keep.trying();
  }
}`,
    poetry: `In endless loops of searching hearts,
A function runs, it never parts.
Through boolean dreams of true and false,
It seeks the one, through joy and loss.

When found at last, the loop will break,
Returning joy for love's own sake.`
  },
  {
    code: `const life = [];
while (alive) {
  life.push(memory);
  if (memory.isGood) {
    save(memory);
  }
}`,
    poetry: `An empty array, a life begins,
Collecting moments, losses, wins.
While breath still fills these mortal frames,
We push our memories, joys and pains.

The good ones saved in cache divine,
Each precious moment, yours and mine.`
  },
  {
    code: `try {
  dream.achieve();
} catch (failure) {
  learn(failure);
  retry();
}`,
    poetry: `Within the try block of our days,
We reach for dreams in countless ways.
But when exceptions fill the air,
And failure catches, dark despair—

We learn from errors, start anew,
And retry dreams with clearer view.`
  },
]

export default function CodePoetry({ onClose }: AppProps) {
  const [view, setView] = useState<'input' | 'transforming' | 'result'>('input')
  const [selectedSample, setSelectedSample] = useState(0)
  const [userCode, setUserCode] = useState(sampleCode[0].code)
  const [generatedPoem, setGeneratedPoem] = useState('')
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])

  const handleTransform = () => {
    setView('transforming')
    setCurrentLine(0)
    setDisplayedLines([])

    // Find matching poem or use first sample
    const matched = sampleCode.find((s) => s.code.trim() === userCode.trim()) || sampleCode[0]
    setGeneratedPoem(matched.poetry)
  }

  useEffect(() => {
    if (view === 'transforming' && generatedPoem) {
      const lines = generatedPoem.split('\n')

      if (currentLine < lines.length) {
        const timer = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, lines[currentLine]])
          setCurrentLine((c) => c + 1)
        }, 500)
        return () => clearTimeout(timer)
      } else {
        setTimeout(() => setView('result'), 1000)
      }
    }
  }, [view, currentLine, generatedPoem])

  return (
    <div className="h-full flex flex-col p-4">
      <AnimatePresence mode="wait">
        {view === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-4">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <h3 className="text-lg font-display font-bold text-white mt-2">Code → Poetry</h3>
              <p className="text-sm text-white/60">Transform your code into beautiful verses</p>
            </div>

            {/* Sample selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {sampleCode.map((sample, index) => (
                <motion.button
                  key={index}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm ${
                    selectedSample === index
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSample(index)
                    setUserCode(sample.code)
                  }}
                >
                  Sample {index + 1}
                </motion.button>
              ))}
            </div>

            {/* Code input */}
            <div className="flex-1 relative rounded-xl overflow-hidden bg-[#1e1e2e] border border-white/10">
              <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-white/40">your-code.js</span>
              </div>
              <textarea
                className="w-full h-full pt-10 p-4 bg-transparent text-green-400 font-mono text-sm resize-none outline-none"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Transform button */}
            <motion.button
              className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-slate-400 to-zinc-500 font-bold text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTransform}
            >
              ✨ Transform to Poetry
            </motion.button>
          </motion.div>
        )}

        {view === 'transforming' && (
          <motion.div
            key="transforming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {/* Animated transformation */}
            <div className="relative w-32 h-32 mb-8">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-400 to-zinc-500"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-[#0f0f1a] flex items-center justify-center"
                animate={{ rotate: [0, -180, -360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.span
                  className="text-4xl"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </motion.div>
            </div>

            <p className="text-white/70 mb-8">Transforming code into poetry...</p>

            {/* Live poetry generation */}
            <div className="w-full max-w-xs text-center">
              {displayedLines.map((line, index) => (
                <motion.p
                  key={index}
                  className="text-white/80 italic mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">📜</span>
              <h3 className="text-lg font-display font-bold text-white mt-2">Your Code Poetry</h3>
            </div>

            {/* Original code (collapsed) */}
            <motion.div
              className="bg-white/5 rounded-xl p-3 mb-4"
              initial={{ height: 'auto' }}
            >
              <p className="text-xs text-white/50 mb-2">ORIGINAL CODE</p>
              <pre className="text-xs text-green-400/70 font-mono overflow-hidden whitespace-pre-wrap">
                {userCode.slice(0, 100)}...
              </pre>
            </motion.div>

            {/* Generated poem */}
            <div className="flex-1 bg-gradient-to-br from-slate-500/10 to-zinc-500/10 rounded-2xl p-6 border border-white/10 overflow-auto">
              <div className="relative">
                <span className="absolute -top-2 -left-2 text-4xl opacity-20">"</span>
                <span className="absolute -bottom-2 -right-2 text-4xl opacity-20">"</span>

                {generatedPoem.split('\n').map((line, index) => (
                  <motion.p
                    key={index}
                    className={`text-white/90 italic leading-relaxed ${
                      line === '' ? 'h-4' : ''
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <motion.button
                className="flex-1 py-3 rounded-xl bg-white/10 text-white/70"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setView('input')
                  setDisplayedLines([])
                  setCurrentLine(0)
                }}
              >
                Try Again
              </motion.button>
              <motion.button
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-slate-400 to-zinc-500 font-bold"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Simulate share
                  alert('Poetry copied to clipboard! ✨')
                }}
              >
                Share ✨
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
