'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AppProps {
  onClose: () => void
}

interface Message {
  id: number
  user: string
  avatar: string
  text: string
  time: string
  isMe?: boolean
}

interface TimeSlot {
  time: string
  votes: string[]
}

const members = [
  { name: 'You', avatar: '😊', color: '#6366f1' },
  { name: 'Alex', avatar: '🧑‍💻', color: '#ec4899' },
  { name: 'Sam', avatar: '👩‍🎨', color: '#22c55e' },
  { name: 'Jordan', avatar: '🎮', color: '#f59e0b' },
]

const initialMessages: Message[] = [
  { id: 1, user: 'Alex', avatar: '🧑‍💻', text: 'Hey everyone! Ready for the study session?', time: '2:30 PM' },
  { id: 2, user: 'Sam', avatar: '👩‍🎨', text: 'Yes! Did everyone vote on the time?', time: '2:31 PM' },
  { id: 3, user: 'Jordan', avatar: '🎮', text: "I'm free after 4pm", time: '2:32 PM' },
]

const timeSlots: TimeSlot[] = [
  { time: '3:00 PM', votes: ['Alex'] },
  { time: '4:00 PM', votes: ['Sam', 'Jordan'] },
  { time: '5:00 PM', votes: ['Alex', 'Sam'] },
  { time: '6:00 PM', votes: [] },
]

export default function GroupSync({ onClose }: AppProps) {
  const [view, setView] = useState<'chat' | 'schedule' | 'members'>('chat')
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [slots, setSlots] = useState(timeSlots)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate other members typing
  useEffect(() => {
    if (messages.length > 3 && messages[messages.length - 1].isMe) {
      const typingDelay = setTimeout(() => setIsTyping(true), 1000)
      const responseDelay = setTimeout(() => {
        setIsTyping(false)
        const responses = [
          { user: 'Alex', avatar: '🧑‍💻', text: 'Good point! 👍' },
          { user: 'Sam', avatar: '👩‍🎨', text: 'I agree!' },
          { user: 'Jordan', avatar: '🎮', text: 'Same here!' },
        ]
        const response = responses[Math.floor(Math.random() * responses.length)]
        setMessages((m) => [
          ...m,
          { ...response, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ])
      }, 2500)

      return () => {
        clearTimeout(typingDelay)
        clearTimeout(responseDelay)
      }
    }
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    setMessages([
      ...messages,
      {
        id: Date.now(),
        user: 'You',
        avatar: '😊',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      },
    ])
    setNewMessage('')
  }

  const toggleVote = (timeIndex: number) => {
    setSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== timeIndex) return slot
        const hasVoted = slot.votes.includes('You')
        return {
          ...slot,
          votes: hasVoted
            ? slot.votes.filter((v) => v !== 'You')
            : [...slot.votes, 'You'],
        }
      })
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Navigation tabs */}
      <div className="flex border-b border-white/10">
        {['chat', 'schedule', 'members'].map((tab) => (
          <motion.button
            key={tab}
            className={`flex-1 py-3 text-sm font-medium capitalize ${
              view === tab ? 'text-white border-b-2 border-indigo-500' : 'text-white/50'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(tab as typeof view)}
          >
            {tab === 'chat' && '💬 '}
            {tab === 'schedule' && '📅 '}
            {tab === 'members' && '👥 '}
            {tab}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      {msg.avatar}
                    </div>
                  )}
                  <div className={`max-w-[70%] ${msg.isMe ? 'items-end' : ''}`}>
                    {!msg.isMe && (
                      <p className="text-xs text-white/50 mb-1">{msg.user}</p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.isMe
                          ? 'bg-indigo-500 rounded-br-md'
                          : 'bg-white/10 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">{msg.time}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    🧑‍💻
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-white/50"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500"
                />
                <motion.button
                  className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-4 overflow-auto"
          >
            <h3 className="font-bold mb-2">Vote for Meeting Time</h3>
            <p className="text-sm text-white/60 mb-4">Tap to vote for times that work for you</p>

            <div className="space-y-3">
              {slots.map((slot, index) => {
                const hasVoted = slot.votes.includes('You')
                const percentage = (slot.votes.length / members.length) * 100

                return (
                  <motion.button
                    key={slot.time}
                    className={`w-full rounded-xl p-4 text-left transition-colors ${
                      hasVoted ? 'bg-indigo-500/20 ring-2 ring-indigo-500' : 'bg-white/5'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleVote(index)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{slot.time}</span>
                      <span className="text-sm text-white/60">
                        {slot.votes.length}/{members.length} votes
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full bg-indigo-500 rounded-full"
                        animate={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Voters */}
                    <div className="flex gap-1">
                      {slot.votes.map((voter) => {
                        const member = members.find((m) => m.name === voter)
                        return (
                          <span
                            key={voter}
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{ backgroundColor: `${member?.color}30` }}
                          >
                            {member?.avatar} {voter}
                          </span>
                        )
                      })}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Best time */}
            <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
              <p className="text-sm text-green-400 font-medium">🎯 Best Time</p>
              <p className="text-xl font-bold">
                {[...slots].sort((a, b) => b.votes.length - a.votes.length)[0].time}
              </p>
              <p className="text-sm text-white/60">Most votes from the group</p>
            </div>
          </motion.div>
        )}

        {view === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-4 overflow-auto"
          >
            <h3 className="font-bold mb-2">Study Group</h3>
            <p className="text-sm text-white/60 mb-4">4 members</p>

            <div className="space-y-3">
              {members.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${member.color}30` }}
                  >
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {member.name}
                      {member.name === 'You' && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-white/50">
                      {member.name === 'You' ? 'Admin' : 'Member'}
                    </p>
                  </div>
                  <motion.div
                    className="w-3 h-3 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Invite button */}
            <motion.button
              className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-white/20 text-white/50 flex items-center justify-center gap-2"
              whileHover={{ borderColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span>+</span>
              <span>Invite Members</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
