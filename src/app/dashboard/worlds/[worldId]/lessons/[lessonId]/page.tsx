import { WORLDS } from '@/constants/worlds';
import LessonClient from './LessonClient';
import SentenceLessonClient from '@/components/sentences/SentenceLessonClient';

// Generate static params for all world/lesson combinations at build time
export function generateStaticParams() {
  const params: { worldId: string; lessonId: string }[] = [];

  for (const world of WORLDS) {
    for (let i = 1; i <= world.lessonCount; i++) {
      params.push({
        worldId: world.id,
        lessonId: i.toString(),
      });
    }
  }

  return params;
}

interface LessonPageProps {
  params: { worldId: string; lessonId: string };
}

export default function LessonPage({ params }: LessonPageProps) {
  // Use SentenceLessonClient for Sentence Station (intonation practice)
  if (params.worldId === 'sentence-station') {
    return <SentenceLessonClient worldId={params.worldId} lessonId={params.lessonId} />;
  }

  // Use regular LessonClient for phoneme-based lessons
  return <LessonClient worldId={params.worldId} lessonId={params.lessonId} />;
}
