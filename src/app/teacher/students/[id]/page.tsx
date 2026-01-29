'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Flame,
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Award,
} from 'lucide-react';
import { useTeacherStore } from '@/stores/teacherStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WORLDS } from '@/constants/worlds';
import { cn } from '@/lib/utils/cn';

export default function StudentProgressPage() {
  const params = useParams();
  const studentId = params.id as string;

  const { selectedStudent, getStudentProgress, isLoading } = useTeacherStore();

  useEffect(() => {
    if (studentId) {
      getStudentProgress(studentId);
    }
  }, [studentId, getStudentProgress]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && !selectedStudent) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading student progress...</p>
        </div>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Student not found</p>
            <Link href="/teacher/classrooms">
              <Button variant="primary" className="mt-4">
                Back to Classrooms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate world progress
  const worldProgress = WORLDS.map((world) => {
    const completedInWorld = selectedStudent.completedLessons.filter((lessonId) =>
      lessonId.startsWith(`${world.id}-`)
    ).length;
    return {
      ...world,
      completed: completedInWorld,
      total: world.totalLessons,
      percentage: Math.round((completedInWorld / world.totalLessons) * 100),
    };
  });

  // Calculate phoneme mastery stats
  const phonemeStats = Object.entries(selectedStudent.phonemeProgress || {});
  const masteredPhonemes = phonemeStats.filter(
    ([, data]) => data.masteryLevel >= 80
  ).length;
  const learningPhonemes = phonemeStats.filter(
    ([, data]) => data.masteryLevel >= 40 && data.masteryLevel < 80
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teacher/classrooms">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {selectedStudent.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedStudent.displayName}
            </h1>
            <p className="text-gray-500">
              Level {selectedStudent.level} • {selectedStudent.levelTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{selectedStudent.level}</p>
              <p className="text-xs text-gray-500">Level</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {selectedStudent.xp.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total XP</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-2">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {selectedStudent.currentStreak}
              </p>
              <p className="text-xs text-gray-500">Current Streak</p>
              <p className="text-xs text-gray-400">Best: {selectedStudent.longestStreak}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {selectedStudent.lessonsCompleted}
              </p>
              <p className="text-xs text-gray-500">Lessons Completed</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {selectedStudent.achievements.length}
              </p>
              <p className="text-xs text-gray-500">Achievements</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* World Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                World Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {worldProgress.map((world, index) => (
                <div key={world.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{world.emoji}</span>
                      <span className="font-medium text-gray-800">{world.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {world.completed}/{world.total} lessons
                    </span>
                  </div>
                  <ProgressBar
                    value={world.percentage}
                    max={100}
                    color={world.theme.primaryColor}
                    showLabel={false}
                    size="sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Phoneme Mastery Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="bg-white/80 backdrop-blur h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Phoneme Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{masteredPhonemes}</p>
                  <p className="text-xs text-gray-500 mt-1">Mastered</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-3xl font-bold text-yellow-600">{learningPhonemes}</p>
                  <p className="text-xs text-gray-500 mt-1">Learning</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-600">
                    {44 - masteredPhonemes - learningPhonemes}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Not Started</p>
                </div>
              </div>

              {/* Phoneme Progress Grid */}
              {phonemeStats.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {phonemeStats
                    .sort(([, a], [, b]) => b.masteryLevel - a.masteryLevel)
                    .slice(0, 10)
                    .map(([phonemeId, data]) => (
                      <div
                        key={phonemeId}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <span className="font-bold text-purple-600">{phonemeId}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {data.attempts} attempts
                            </span>
                            <span
                              className={cn(
                                'font-medium',
                                data.masteryLevel >= 80
                                  ? 'text-green-600'
                                  : data.masteryLevel >= 40
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                              )}
                            >
                              {data.masteryLevel}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={cn(
                                'h-2 rounded-full transition-all',
                                data.masteryLevel >= 80
                                  ? 'bg-green-500'
                                  : data.masteryLevel >= 40
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                              )}
                              style={{ width: `${data.masteryLevel}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No phoneme progress data yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity & Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Activity Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Last Active</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(selectedStudent.lastActivityAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-medium text-gray-800 flex items-center gap-1">
                    <Flame
                      className={cn(
                        'w-4 h-4',
                        selectedStudent.currentStreak > 0
                          ? 'text-orange-500'
                          : 'text-gray-300'
                      )}
                    />
                    {selectedStudent.currentStreak} days
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Longest Streak</span>
                  <span className="font-medium text-gray-800">
                    {selectedStudent.longestStreak} days
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Level Progress</span>
                  <span className="font-medium text-gray-800">
                    {selectedStudent.levelProgress}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Unlocked Achievements ({selectedStudent.achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStudent.achievements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.achievements.map((achievementId) => (
                    <div
                      key={achievementId}
                      className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-700"
                    >
                      {achievementId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No achievements unlocked yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
