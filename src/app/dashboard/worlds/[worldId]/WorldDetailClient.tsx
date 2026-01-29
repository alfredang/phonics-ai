'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Lock,
  Star,
  Play,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { getWorld, isWorldUnlocked } from '@/constants/worlds';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface WorldDetailClientProps {
  worldId: string;
}

export default function WorldDetailClient({ worldId }: WorldDetailClientProps) {
  const router = useRouter();
  const { unlockedWorlds, completedLessons, level, xp } = useGameStore();
  const [world, setWorld] = useState(getWorld(worldId));

  useEffect(() => {
    const foundWorld = getWorld(worldId);
    if (!foundWorld) {
      router.push('/dashboard/worlds');
      return;
    }
    setWorld(foundWorld);
  }, [worldId, router]);

  if (!world) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const unlocked = isWorldUnlocked(world.id, unlockedWorlds, level, xp);

  // Generate lesson nodes (simplified - would come from actual lesson data)
  const lessons = Array.from({ length: world.lessonCount }, (_, i) => {
    const lessonId = `${world.id}-lesson-${i + 1}`;
    const isCompleted = completedLessons.includes(lessonId);
    const isAvailable = i === 0 || completedLessons.includes(`${world.id}-lesson-${i}`);
    return {
      id: lessonId,
      number: i + 1,
      name: `Lesson ${i + 1}`,
      isCompleted,
      isAvailable: unlocked && isAvailable,
      stars: isCompleted ? Math.floor(Math.random() * 3) + 1 : 0, // Placeholder
    };
  });

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / world.lessonCount) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/dashboard/worlds">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Worlds
        </Button>
      </Link>

      {/* World Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${world.theme.gradientFrom}, ${world.theme.gradientTo})`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{world.emoji}</span>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{world.name}</h1>
              <p className="text-white/80 mt-1">{world.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-bold">
                {completedCount}/{world.lessonCount} lessons
              </span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* Focus Areas */}
          <div className="mt-6 flex flex-wrap gap-2">
            {world.focusAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lesson Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Lessons</h2>

        {!unlocked ? (
          <Card className="bg-gray-50">
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                World Locked
              </h3>
              <p className="text-gray-500">
                Complete the previous world to unlock this one.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  href={
                    lesson.isAvailable
                      ? `/dashboard/worlds/${world.id}/lessons/${lesson.number}`
                      : '#'
                  }
                  className={cn(
                    !lesson.isAvailable && 'pointer-events-none'
                  )}
                >
                  <div
                    className={cn(
                      'relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all',
                      lesson.isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg'
                        : lesson.isAvailable
                        ? 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-md cursor-pointer'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {lesson.isCompleted ? (
                      <>
                        <CheckCircle className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">{lesson.number}</span>
                        {/* Stars */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-3 h-3',
                                star <= lesson.stars
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-white/50'
                              )}
                            />
                          ))}
                        </div>
                      </>
                    ) : lesson.isAvailable ? (
                      <>
                        <Play className="w-5 h-5 text-purple-500 mb-1" />
                        <span className="text-sm font-bold text-gray-700">
                          {lesson.number}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mb-1" />
                        <span className="text-xs">{lesson.number}</span>
                      </>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Start Learning Button */}
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center pb-8"
        >
          <Link href={`/dashboard/worlds/${world.id}/lessons/1`}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<Sparkles className="w-5 h-5" />}
            >
              {completedCount > 0 ? 'Continue Learning' : 'Start Learning'}
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
