'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Map, Sparkles } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { WORLDS, isWorldUnlocked, WorldDefinition } from '@/constants/worlds';
import { WorldCard } from '@/components/worlds/WorldCard';

export default function WorldsPage() {
  const router = useRouter();
  const { unlockedWorlds, completedLessons, level, xp } = useGameStore();

  const handleWorldClick = (world: WorldDefinition) => {
    router.push(`/dashboard/worlds/${world.id}`);
  };

  // Calculate progress for each world (simplified)
  const getWorldProgress = (worldId: string) => {
    const world = WORLDS.find((w) => w.id === worldId);
    if (!world) return 0;

    // Count completed lessons for this world
    const worldLessons = completedLessons.filter((id) => id.startsWith(worldId));
    return Math.round((worldLessons.length / world.lessonCount) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <Map className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">World Map</h1>
        <p className="text-gray-600">
          Choose your adventure and master new phonics skills!
        </p>
      </motion.div>

      {/* World path */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-green-300 via-blue-300 via-yellow-300 to-pink-300 -translate-x-1/2 z-0" />

        {/* Worlds */}
        <div className="relative z-10 space-y-8">
          {WORLDS.map((world, index) => {
            const unlocked = isWorldUnlocked(world.id, unlockedWorlds, level, xp);
            const progress = getWorldProgress(world.id);
            const isComplete = progress >= 100;

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {/* Connection dot */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-md ${
                    unlocked ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                  style={{ top: `${index * 140 + 60}px` }}
                />

                {/* World card */}
                <div className="w-full max-w-md">
                  <WorldCard
                    world={world}
                    isUnlocked={unlocked}
                    isComplete={isComplete}
                    progress={progress}
                    onClick={() => handleWorldClick(world)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Coming soon indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12 pb-8"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-purple-700 font-medium">More worlds coming soon!</span>
        </div>
      </motion.div>
    </div>
  );
}
