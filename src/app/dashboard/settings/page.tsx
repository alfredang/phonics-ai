'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Eye,
  Gamepad2,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Sun,
  Type,
  Zap,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface SettingToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function SettingToggle({ label, description, enabled, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors',
          enabled ? 'bg-purple-500' : 'bg-gray-300'
        )}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );
}

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

function SettingSlider({ label, value, min, max, step = 1, onChange }: SettingSliderProps) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-gray-800">{label}</p>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuthStore();

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(50);
  const [autoplayAudio, setAutoplayAudio] = useState(true);

  // Speech settings
  const [speechRate, setSpeechRate] = useState(1.0);

  // Display settings
  const [showIPA, setShowIPA] = useState(true);
  const [showPhonemeColors, setShowPhonemeColors] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Gameplay settings
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showHints, setShowHints] = useState(true);

  // Notification settings
  const [dailyReminder, setDailyReminder] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500">Customize your learning experience</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Audio Settings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-500" />
              Audio
            </h2>
            <div className="divide-y">
              <SettingToggle
                label="Sound Effects"
                description="Play sounds for interactions and feedback"
                enabled={soundEnabled}
                onChange={setSoundEnabled}
              />
              <SettingSlider
                label="Sound Volume"
                value={soundVolume}
                min={0}
                max={100}
                onChange={setSoundVolume}
              />
              <SettingToggle
                label="Background Music"
                description="Play music during lessons and games"
                enabled={musicEnabled}
                onChange={setMusicEnabled}
              />
              <SettingSlider
                label="Music Volume"
                value={musicVolume}
                min={0}
                max={100}
                onChange={setMusicVolume}
              />
              <SettingToggle
                label="Auto-play Audio"
                description="Automatically play phoneme sounds"
                enabled={autoplayAudio}
                onChange={setAutoplayAudio}
              />
            </div>
          </CardContent>
        </Card>

        {/* Speech Settings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-500" />
              Speech
            </h2>
            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-800">Speech Rate</p>
                <span className="text-sm text-gray-500">{speechRate}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Slower</span>
                <span>Normal</span>
                <span>Faster</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              Display
            </h2>
            <div className="divide-y">
              <SettingToggle
                label="Show IPA Notation"
                description="Display phonetic alphabet symbols"
                enabled={showIPA}
                onChange={setShowIPA}
              />
              <SettingToggle
                label="Phoneme Colors"
                description="Color-code phonemes by category"
                enabled={showPhonemeColors}
                onChange={setShowPhonemeColors}
              />
              <div className="py-3">
                <p className="font-medium text-gray-800 mb-3">Font Size</p>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-lg font-medium transition-colors capitalize',
                        fontSize === size
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gameplay Settings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-orange-500" />
              Gameplay
            </h2>
            <div className="divide-y">
              <div className="py-3">
                <p className="font-medium text-gray-800 mb-3">Difficulty</p>
                <div className="flex gap-2">
                  {(['easy', 'normal', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-lg font-medium transition-colors capitalize',
                        difficulty === level
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <SettingToggle
                label="Auto-advance Lessons"
                description="Move to next phase automatically"
                enabled={autoAdvance}
                onChange={setAutoAdvance}
              />
              <SettingToggle
                label="Show Hints"
                description="Display helpful tips during lessons"
                enabled={showHints}
                onChange={setShowHints}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notifications
            </h2>
            <div className="divide-y">
              <SettingToggle
                label="Daily Reminder"
                description="Get reminded to practice each day"
                enabled={dailyReminder}
                onChange={setDailyReminder}
              />
              <SettingToggle
                label="Achievement Alerts"
                description="Notify when you unlock achievements"
                enabled={achievementAlerts}
                onChange={setAchievementAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              Account
            </h2>
            <div className="space-y-2">
              <Link href="/dashboard/profile">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">View Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </Link>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Privacy & Security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Help & Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-gray-400 pb-8">
          <p>Phonics AI v1.0.0</p>
          <p className="mt-1">Made with ❤️ for learners everywhere</p>
        </div>
      </div>
    </div>
  );
}
