/**
 * World definitions for the phonics learning journey
 */

export interface WorldDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    gradientFrom: string;
    gradientTo: string;
    bgPattern?: string;
  };
  unlockRequirement: {
    type: 'none' | 'world_complete' | 'level' | 'xp';
    value?: string | number;
  };
  order: number;
  lessonCount: number;
  focusAreas: string[];
}

export const WORLDS: WorldDefinition[] = [
  {
    id: 'letters-land',
    name: 'Letters Land',
    description: 'Master the building blocks of reading - single sounds and letters!',
    emoji: '🔤',
    theme: {
      primaryColor: '#A78BFA',
      secondaryColor: '#C4B5FD',
      accentColor: '#7C3AED',
      gradientFrom: '#A78BFA',
      gradientTo: '#C4B5FD',
    },
    unlockRequirement: { type: 'none' },
    order: 1,
    lessonCount: 20,
    focusAreas: ['Short vowels', 'Basic consonants', 'Letter sounds'],
  },
  {
    id: 'word-city',
    name: 'Word City',
    description: 'Blend sounds together to build amazing words!',
    emoji: '🏙️',
    theme: {
      primaryColor: '#34D399',
      secondaryColor: '#6EE7B7',
      accentColor: '#10B981',
      gradientFrom: '#34D399',
      gradientTo: '#6EE7B7',
    },
    unlockRequirement: { type: 'world_complete', value: 'letters-land' },
    order: 2,
    lessonCount: 25,
    focusAreas: ['CVC words', 'Blending', 'Digraphs'],
  },
  {
    id: 'rule-realm',
    name: 'Rule Realm',
    description: 'Discover the secret patterns and rules of English!',
    emoji: '📜',
    theme: {
      primaryColor: '#60A5FA',
      secondaryColor: '#93C5FD',
      accentColor: '#3B82F6',
      gradientFrom: '#60A5FA',
      gradientTo: '#93C5FD',
    },
    unlockRequirement: { type: 'world_complete', value: 'word-city' },
    order: 3,
    lessonCount: 20,
    focusAreas: ['Silent letters', 'Vowel teams', 'R-controlled vowels'],
  },
  {
    id: 'sentence-station',
    name: 'Sentence Station',
    description: 'Read sentences with expression and style!',
    emoji: '🚂',
    theme: {
      primaryColor: '#FBBF24',
      secondaryColor: '#FCD34D',
      accentColor: '#F59E0B',
      gradientFrom: '#FBBF24',
      gradientTo: '#FCD34D',
    },
    unlockRequirement: { type: 'world_complete', value: 'rule-realm' },
    order: 4,
    lessonCount: 15,
    focusAreas: ['Fluency', 'Intonation', 'Expression'],
  },
  {
    id: 'story-kingdom',
    name: 'Story Kingdom',
    description: 'Read paragraphs and stories like a champion!',
    emoji: '👑',
    theme: {
      primaryColor: '#F472B6',
      secondaryColor: '#F9A8D4',
      accentColor: '#EC4899',
      gradientFrom: '#F472B6',
      gradientTo: '#F9A8D4',
    },
    unlockRequirement: { type: 'world_complete', value: 'sentence-station' },
    order: 5,
    lessonCount: 15,
    focusAreas: ['Comprehension', 'Rhythm', 'Story reading'],
  },
];

export const getWorld = (worldId: string): WorldDefinition | undefined => {
  return WORLDS.find((w) => w.id === worldId);
};

export const getNextWorld = (worldId: string): WorldDefinition | undefined => {
  const currentWorld = WORLDS.find((w) => w.id === worldId);
  if (!currentWorld) return undefined;
  return WORLDS.find((w) => w.order === currentWorld.order + 1);
};

export const isWorldUnlocked = (
  worldId: string,
  completedWorlds: string[],
  userLevel: number,
  userXP: number
): boolean => {
  const world = getWorld(worldId);
  if (!world) return false;

  switch (world.unlockRequirement.type) {
    case 'none':
      return true;
    case 'world_complete':
      return completedWorlds.includes(world.unlockRequirement.value as string);
    case 'level':
      return userLevel >= (world.unlockRequirement.value as number);
    case 'xp':
      return userXP >= (world.unlockRequirement.value as number);
    default:
      return false;
  }
};
