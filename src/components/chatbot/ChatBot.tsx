'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  HelpCircle,
  BookOpen,
  Gamepad2,
  Trophy,
  Volume2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Knowledge base about the app
const KNOWLEDGE_BASE: Record<string, string> = {
  // Getting started
  'how do i start': `Welcome to Phonics AI! 🎉 Here's how to get started:
1. Go to the Dashboard
2. Click on "Letters Land" (World 1)
3. Select Lesson 1 to begin learning!

Each lesson has 4 phases: Listen → Practice → Play → Assess. Have fun learning! 📚`,

  'what is phonics ai': `Phonics AI is an interactive learning app that helps you master English pronunciation! 🗣️

✨ Features:
• 5 Learning Worlds with 95 lessons
• 44 English phonemes (sounds)
• Fun games like Phoneme Pop
• XP, achievements, and daily quests
• AI-powered pronunciation feedback`,

  // Lessons
  'how do lessons work': `Each lesson follows 4 phases:

1️⃣ **Listen** - Hear the phoneme sound and see how to make it
2️⃣ **Practice** - Record yourself and get AI feedback
3️⃣ **Play** - Fun games to reinforce learning
4️⃣ **Assess** - Quiz to test your knowledge

Complete all phases to earn XP and stars! ⭐`,

  'what are phonemes': `Phonemes are the smallest units of sound in a language! 🔤

English has 44 phonemes including:
• Short vowels (a, e, i, o, u)
• Long vowels (ā, ē, ī, ō, ū)
• Consonants (b, c, d, f, etc.)
• Digraphs (sh, ch, th)
• Blends (bl, cr, st)

Learning phonemes helps you read and pronounce words correctly! 📖`,

  // Worlds
  'what are the worlds': `Phonics AI has 5 Learning Worlds:

🔤 **Letters Land** (20 lessons) - Basic letter sounds
🏙️ **Word City** (25 lessons) - Blends & digraphs
📜 **Rule Realm** (20 lessons) - Vowel patterns
🚂 **Sentence Station** (15 lessons) - Fluency & intonation
👑 **Story Kingdom** (15 lessons) - Reading comprehension

Complete each world to unlock the next! 🗺️`,

  // Games
  'what games can i play': `We have fun games to help you learn! 🎮

🫧 **Phoneme Pop** - Pop bubbles with the target sound
🧩 **Word Builder** - Drag letters to build words (coming soon)
🎴 **Sound Match** - Memory matching with audio (coming soon)
⚡ **Sound Race** - Speed-based phoneme ID (coming soon)

Go to Dashboard → Games to play! 🎯`,

  'how to play phoneme pop': `Phoneme Pop is super fun! 🫧

How to play:
1. You'll see a target sound at the top
2. Bubbles with different sounds float up
3. Tap/click bubbles with the TARGET sound only!
4. Avoid wrong sounds or you lose a life ❤️
5. Build combos for bonus points!

Goal: Score as many points before time runs out! ⏱️`,

  // XP and Progress
  'how do i earn xp': `You can earn XP (experience points) by:

⭐ Completing lessons (50-80 XP)
🎮 Playing games (based on score)
🎯 Finishing daily quests (25-35 XP)
🏆 Unlocking achievements (10-500 XP)

XP helps you level up and unlock new titles! 📈`,

  'what are achievements': `Achievements are badges you earn for accomplishments! 🏆

Categories:
• **Progress** - Complete lessons/worlds
• **Streak** - Practice daily
• **Performance** - Get perfect scores
• **Collection** - Master phonemes

Check your achievements in Dashboard → Achievements! 🌟`,

  'what are quests': `Daily Quests give you bonus XP! 🎯

Each day you get 3 new quests like:
• Complete 2 lessons
• Earn 100 XP
• Practice 10 phonemes

Complete them before midnight to claim rewards! ⏰
Check Dashboard → Quests to see your quests.`,

  'what is a streak': `Streaks track your daily practice! 🔥

How it works:
• Practice every day to build your streak
• Miss a day and it resets to 0
• Longer streaks = more achievements!

Your current streak shows on your profile and dashboard. Keep it going! 💪`,

  // Audio
  'how to hear sounds': `To hear phoneme sounds:

🔊 Click the speaker icon on any phoneme card
🔊 In lessons, sounds auto-play (can be turned off)
🔊 In games, tap the target sound to hear it

Make sure your device volume is up! 🎧`,

  'how to record my voice': `Recording your voice is easy! 🎙️

1. In the Practice phase, click the big microphone button
2. Say the word or sound clearly
3. Click again to stop recording
4. Wait for AI feedback on your pronunciation!

Tip: Speak clearly and not too fast for best results. 🗣️`,

  // Account
  'how to see my progress': `Check your progress at Dashboard → Progress! 📊

You'll see:
• Overall completion percentage
• World-by-world progress bars
• Phoneme mastery grid
• Stats like XP, lessons, streak

Keep practicing to fill those progress bars! 🎯`,

  // Navigation
  'where is the dashboard': `The Dashboard is your home base! 🏠

From the Dashboard you can:
• Access Learning Worlds
• View your stats (XP, level, streak)
• Check daily quests
• See recent achievements

Click "Dashboard" in the navigation to go there! 🚀`,

  // Help
  'i need help': `I'm here to help! 💜 Here are some things I can tell you about:

📚 **Learning**: lessons, phonemes, worlds
🎮 **Games**: how to play, scoring
⭐ **Progress**: XP, achievements, quests, streaks
🔊 **Audio**: hearing sounds, recording voice
⚙️ **Settings**: customizing your experience

Just ask me anything! What would you like to know? 🤔`,

  // Settings
  'how to change settings': `Go to Dashboard → Settings (or click the gear icon) ⚙️

You can customize:
• 🔊 Sound & music volume
• 🗣️ Speech rate (slower/faster)
• 👀 Display (IPA, colors, font size)
• 🎮 Difficulty level
• 🔔 Notifications

Make it perfect for you! ✨`,
};

// Quick suggestion buttons
const QUICK_SUGGESTIONS = [
  { icon: <HelpCircle className="w-4 h-4" />, text: 'How do I start?', query: 'how do i start' },
  { icon: <BookOpen className="w-4 h-4" />, text: 'About lessons', query: 'how do lessons work' },
  { icon: <Gamepad2 className="w-4 h-4" />, text: 'Games', query: 'what games can i play' },
  { icon: <Trophy className="w-4 h-4" />, text: 'Earn XP', query: 'how do i earn xp' },
  { icon: <Volume2 className="w-4 h-4" />, text: 'Hear sounds', query: 'how to hear sounds' },
];

function findAnswer(query: string): string {
  const normalizedQuery = query.toLowerCase().trim();

  // Direct match
  if (KNOWLEDGE_BASE[normalizedQuery]) {
    return KNOWLEDGE_BASE[normalizedQuery];
  }

  // Keyword matching
  const keywords: Record<string, string[]> = {
    'how do i start': ['start', 'begin', 'getting started', 'new', 'first time'],
    'what is phonics ai': ['what is', 'about', 'phonics ai', 'this app'],
    'how do lessons work': ['lesson', 'learning', 'teach', 'study', 'phases'],
    'what are phonemes': ['phoneme', 'sound', 'phonics', 'pronunciation'],
    'what are the worlds': ['world', 'level', 'stage', 'letters land', 'word city'],
    'what games can i play': ['game', 'play', 'fun', 'mini game'],
    'how to play phoneme pop': ['phoneme pop', 'bubble', 'pop game'],
    'how do i earn xp': ['xp', 'experience', 'points', 'level up', 'earn'],
    'what are achievements': ['achievement', 'badge', 'trophy', 'unlock'],
    'what are quests': ['quest', 'daily', 'mission', 'task'],
    'what is a streak': ['streak', 'daily streak', 'consecutive'],
    'how to hear sounds': ['hear', 'listen', 'audio', 'speaker', 'sound'],
    'how to record my voice': ['record', 'microphone', 'voice', 'speak', 'mic'],
    'how to see my progress': ['progress', 'stats', 'statistics', 'how am i doing'],
    'where is the dashboard': ['dashboard', 'home', 'main page', 'navigate'],
    'i need help': ['help', 'support', 'assist', 'confused', 'stuck'],
    'how to change settings': ['setting', 'preference', 'customize', 'option', 'volume'],
  };

  for (const [key, keywordList] of Object.entries(keywords)) {
    for (const keyword of keywordList) {
      if (normalizedQuery.includes(keyword)) {
        return KNOWLEDGE_BASE[key];
      }
    }
  }

  // Default response
  return `I'm not sure about that, but I can help you with:

📚 How lessons work
🎮 Playing games
⭐ Earning XP and achievements
🔊 Audio and recording
⚙️ Settings

Try asking about one of these topics! Or type "help" for more options. 💜`;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi there! I'm Phoni 🦉, your learning buddy!

I can help you with:
• How to use Phonics AI
• Learning about phonemes
• Understanding games & quests
• Tips for earning XP

What would you like to know? 💜`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryOverride?: string) => {
    const query = queryOverride || input.trim();
    if (!query) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Get answer
    const answer = findAnswer(query);

    // Add assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg',
          'bg-gradient-to-br from-purple-500 to-pink-500',
          'flex items-center justify-center',
          'hover:shadow-xl transition-shadow',
          isOpen && 'hidden'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          <span className="text-3xl">🦉</span>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.button>

      {/* Tooltip when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-24 z-50 bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700"
          >
            Need help? Ask Phoni! 💜
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🦉</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Phoni</h3>
                  <p className="text-xs text-white/80">Your learning buddy</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 shrink-0">
                      <span className="text-lg">🦉</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap',
                      message.role === 'user'
                        ? 'bg-purple-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-lg">🦉</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion.query}
                      onClick={() => handleSend(suggestion.query)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full text-xs font-medium transition-colors"
                    >
                      {suggestion.icon}
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    input.trim()
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-200 text-gray-400'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
