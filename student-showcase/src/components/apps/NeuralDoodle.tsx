'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

interface Point {
  x: number
  y: number
}

const brushColors = ['#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
const brushSizes = [2, 4, 8, 12]

// Predefined "AI completions" - simple shapes that get added
const completions = [
  // Simple decorations
  { type: 'stars', emoji: '✨' },
  { type: 'hearts', emoji: '💖' },
  { type: 'sparkles', emoji: '⭐' },
  { type: 'flowers', emoji: '🌸' },
  { type: 'magic', emoji: '🪄' },
]

export default function NeuralDoodle({ onClose }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#ffffff')
  const [brushSize, setBrushSize] = useState(4)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionEmojis, setCompletionEmojis] = useState<{x: number, y: number, emoji: string}[]>([])
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastPointRef = useRef<Point | null>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Fill with dark background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const draw = useCallback((point: Point) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !lastPointRef.current) return

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()

    lastPointRef.current = point
    setHasDrawn(true)
  }, [color, brushSize])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const point = getCanvasPoint(e)
    if (!point) return

    setIsDrawing(true)
    lastPointRef.current = point

    // Draw a dot at the starting point
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const continueDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return

    const point = getCanvasPoint(e)
    if (point) draw(point)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    setHasDrawn(false)
    setShowCompletion(false)
    setCompletionEmojis([])
  }

  const handleAIComplete = async () => {
    if (!hasDrawn) return

    setIsProcessing(true)

    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1500))

    // Generate random completion emojis around the canvas
    const canvas = canvasRef.current
    if (canvas) {
      const newEmojis: {x: number, y: number, emoji: string}[] = []
      const completion = completions[Math.floor(Math.random() * completions.length)]

      for (let i = 0; i < 8; i++) {
        newEmojis.push({
          x: Math.random() * (canvas.offsetWidth - 40) + 20,
          y: Math.random() * (canvas.offsetHeight - 40) + 20,
          emoji: completion.emoji,
        })
      }

      // Also draw some lines on the canvas to simulate AI completion
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        ctx.lineCap = 'round'

        // Draw some random curves
        for (let i = 0; i < 3; i++) {
          const startX = Math.random() * canvas.offsetWidth
          const startY = Math.random() * canvas.offsetHeight
          const endX = Math.random() * canvas.offsetWidth
          const endY = Math.random() * canvas.offsetHeight
          const cpX = Math.random() * canvas.offsetWidth
          const cpY = Math.random() * canvas.offsetHeight

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.quadraticCurveTo(cpX, cpY, endX, endY)
          ctx.stroke()
        }
      }

      setCompletionEmojis(newEmojis)
    }

    setIsProcessing(false)
    setShowCompletion(true)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Canvas area */}
      <div className="flex-1 relative bg-[#1a1a2e] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={continueDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={continueDrawing}
          onTouchEnd={stopDrawing}
        />

        {/* Completion emojis overlay */}
        <AnimatePresence>
          {showCompletion && completionEmojis.map((item, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl pointer-events-none"
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-teal-500/30 border-t-teal-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.p
                className="mt-4 text-white/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                AI is completing your doodle...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.span
                className="text-5xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✏️
              </motion.span>
              <p className="text-white/40 mt-2">Draw something!</p>
            </div>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="p-4 bg-[#0f0f1a] border-t border-white/10">
        {/* Color picker */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-white/50">COLOR</span>
          <div className="flex gap-2">
            {brushColors.map((c) => (
              <motion.button
                key={c}
                className={`w-7 h-7 rounded-full ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f0f1a]' : ''}`}
                style={{ backgroundColor: c }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Brush size */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-white/50">SIZE</span>
          <div className="flex gap-3 items-center">
            {brushSizes.map((size) => (
              <motion.button
                key={size}
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  brushSize === size ? 'bg-white/20' : 'bg-white/5'
                }`}
                whileTap={{ scale: 0.9 }}
                onClick={() => setBrushSize(size)}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: size + 2, height: size + 2 }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            className="flex-1 py-3 rounded-xl bg-white/10 text-white/70 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
            onClick={clearCanvas}
          >
            <span>🗑️</span>
            <span>Clear</span>
          </motion.button>
          <motion.button
            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
              hasDrawn
                ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white'
                : 'bg-white/10 text-white/30'
            }`}
            whileTap={hasDrawn ? { scale: 0.98 } : {}}
            onClick={handleAIComplete}
            disabled={!hasDrawn || isProcessing}
          >
            <span>🧠</span>
            <span>AI Complete</span>
          </motion.button>
        </div>

        {/* Completion message */}
        <AnimatePresence>
          {showCompletion && (
            <motion.div
              className="mt-4 p-3 bg-teal-500/20 rounded-xl text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="text-teal-400 font-medium">✨ AI enhanced your doodle!</p>
              <p className="text-xs text-white/50 mt-1">Neural magic applied</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
