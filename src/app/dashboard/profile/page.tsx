'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Star,
  Trophy,
  Flame,
  BookOpen,
  Settings,
  Edit2,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const {
    level,
    xp,
    currentStreak,
    longestStreak,
    completedLessons,
    achievements,
  } = useGameStore();

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate days since joining
  const daysSinceJoined = user?.createdAt
    ? Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // Level titles
  const levelTitles = [
    'Sound Seeker',
    'Letter Learner',
    'Word Warrior',
    'Reading Rookie',
    'Phonics Fan',
    'Sound Scholar',
    'Word Wizard',
    'Reading Star',
    'Phonics Pro',
    'Reading Master',
  ];

  const currentTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  // Role badge colors
  const roleColors: Record<string, { bg: string; text: string; label: string }> = {
    learner: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Learner' },
    teacher: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Teacher' },
    parent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Parent' },
    admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Administrator' },
  };

  const roleStyle = user?.role && roleColors[user.role] ? roleColors[user.role] : roleColors.learner;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500">View and manage your account</p>
          </div>
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
            Settings
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card className="mb-8 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">
                <span className="text-sm font-bold">{level}</span>
              </div>
            </div>

            {/* Name and role */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.displayName || 'Guest User'}
                </h2>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    roleStyle.bg,
                    roleStyle.text
                  )}
                >
                  {roleStyle.label}
                </span>
              </div>
              <p className="text-gray-500">{currentTitle}</p>
            </div>

            {/* Edit button */}
            <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-4 h-4" />}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-gray-800">{xp.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total XP</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-gray-800">{completedLessons.length}</div>
            <div className="text-xs text-gray-500">Lessons Done</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-gray-800">{longestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-gray-800">{achievements.length}</div>
            <div className="text-xs text-gray-500">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user?.email || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-800">{formatDate(user?.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Account Type</p>
                  <p className="font-medium text-gray-800 capitalize">{user?.role || 'Learner'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Learning Journey
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-600">Current Level</span>
                <span className="font-bold text-purple-600">Level {level}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Days Learning</span>
                <span className="font-bold text-blue-600">{daysSinceJoined} days</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-bold text-orange-600">{currentStreak} days</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-bold text-green-600">
                  {completedLessons.length > 0
                    ? Math.round((completedLessons.length / 95) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard/progress">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-blue-50 rounded-xl text-center cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Progress</span>
              </motion.div>
            </Link>

            <Link href="/dashboard/achievements">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-purple-50 rounded-xl text-center cursor-pointer hover:bg-purple-100 transition-colors"
              >
                <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Achievements</span>
              </motion.div>
            </Link>

            <Link href="/dashboard/quests">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-orange-50 rounded-xl text-center cursor-pointer hover:bg-orange-100 transition-colors"
              >
                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Quests</span>
              </motion.div>
            </Link>

            <Link href="/dashboard/settings">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gray-50 rounded-xl text-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Settings</span>
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
