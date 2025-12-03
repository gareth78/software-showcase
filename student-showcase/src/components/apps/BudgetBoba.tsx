'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

interface Expense {
  id: number
  category: string
  amount: number
  description: string
  date: Date
}

const categories = [
  { id: 'boba', emoji: '🧋', name: 'Boba', color: '#f59e0b' },
  { id: 'food', emoji: '🍜', name: 'Food', color: '#ef4444' },
  { id: 'transport', emoji: '🚌', name: 'Transport', color: '#3b82f6' },
  { id: 'shopping', emoji: '🛍️', name: 'Shopping', color: '#ec4899' },
  { id: 'entertainment', emoji: '🎮', name: 'Fun', color: '#8b5cf6' },
  { id: 'other', emoji: '✨', name: 'Other', color: '#6b7280' },
]

const initialExpenses: Expense[] = [
  { id: 1, category: 'boba', amount: 6.50, description: 'Tiger Sugar', date: new Date() },
  { id: 2, category: 'food', amount: 12.00, description: 'Lunch', date: new Date() },
  { id: 3, category: 'transport', amount: 2.75, description: 'Bus fare', date: new Date(Date.now() - 86400000) },
]

export default function BudgetBoba({ onClose }: AppProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [view, setView] = useState<'home' | 'add' | 'stats'>('home')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [budget] = useState(200)

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = budget - totalSpent

  const getCategoryTotal = (categoryId: string) => {
    return expenses.filter((e) => e.category === categoryId).reduce((sum, e) => sum + e.amount, 0)
  }

  const addExpense = () => {
    if (!selectedCategory || !amount) return

    const newExpense: Expense = {
      id: Date.now(),
      category: selectedCategory,
      amount: parseFloat(amount),
      description: description || categories.find((c) => c.id === selectedCategory)?.name || '',
      date: new Date(),
    }

    setExpenses([newExpense, ...expenses])
    setSelectedCategory(null)
    setAmount('')
    setDescription('')
    setView('home')
  }

  return (
    <div className="h-full flex flex-col p-4">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Budget overview */}
            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🧋
                </motion.span>
                <div>
                  <p className="text-sm text-white/60">Monthly Budget</p>
                  <p className="text-2xl font-bold text-white">${budget.toFixed(2)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      remaining < 50 ? 'bg-red-500' : remaining < 100 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalSpent / budget) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-white/60">Spent: ${totalSpent.toFixed(2)}</span>
                <span className={remaining < 50 ? 'text-red-400' : 'text-green-400'}>
                  ${remaining.toFixed(2)} left
                </span>
              </div>
            </div>

            {/* Categories breakdown */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-white/70 mb-3">SPENDING BY CATEGORY</h4>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const total = getCategoryTotal(cat.id)
                  const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0
                  return (
                    <motion.div
                      key={cat.id}
                      className="bg-white/5 rounded-xl p-3 text-center"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <p className="text-xs text-white/50 mt-1">{cat.name}</p>
                      <p className="text-sm font-bold" style={{ color: cat.color }}>
                        ${total.toFixed(0)}
                      </p>
                      {percentage > 0 && (
                        <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Recent transactions */}
            <div className="flex-1 overflow-auto no-scrollbar">
              <h4 className="text-sm font-bold text-white/70 mb-3">RECENT TRANSACTIONS</h4>
              {expenses.map((expense, index) => {
                const cat = categories.find((c) => c.id === expense.category)
                return (
                  <motion.div
                    key={expense.id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-3 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${cat?.color}20` }}
                    >
                      {cat?.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{expense.description}</p>
                      <p className="text-xs text-white/50">{expense.date.toLocaleDateString()}</p>
                    </div>
                    <p className="font-bold" style={{ color: cat?.color }}>
                      -${expense.amount.toFixed(2)}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Add button */}
            <motion.button
              className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 font-bold text-black"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('add')}
            >
              + Add Expense
            </motion.button>
          </motion.div>
        )}

        {view === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Add Expense</h3>
              <button onClick={() => setView('home')} className="text-white/50">✕</button>
            </div>

            {/* Category selection */}
            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3">What did you spend on?</p>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    className={`p-3 rounded-xl text-center ${
                      selectedCategory === cat.id
                        ? ''
                        : 'bg-white/5'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === cat.id ? `${cat.color}20` : undefined,
                      boxShadow: selectedCategory === cat.id ? `0 0 0 2px ${cat.color}` : undefined,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <p className="text-xs text-white/60 mt-1">{cat.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3">How much?</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-white/50">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/10 rounded-xl px-10 py-4 text-2xl font-bold text-white placeholder-white/30 outline-none focus:ring-2 ring-amber-400"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3">Description (optional)</p>
              <input
                type="text"
                placeholder="What was it for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 ring-amber-400"
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mb-6">
              {[5, 10, 20, 50].map((val) => (
                <motion.button
                  key={val}
                  className="flex-1 py-2 rounded-lg bg-white/10 text-sm"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(val.toString())}
                >
                  ${val}
                </motion.button>
              ))}
            </div>

            {/* Submit */}
            <motion.button
              className={`mt-auto w-full py-4 rounded-2xl font-bold ${
                selectedCategory && amount
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black'
                  : 'bg-white/10 text-white/30'
              }`}
              whileHover={selectedCategory && amount ? { scale: 1.02 } : {}}
              whileTap={selectedCategory && amount ? { scale: 0.98 } : {}}
              onClick={addExpense}
              disabled={!selectedCategory || !amount}
            >
              Add Expense
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
