import { WORLDS } from '@/constants/worlds';
import WorldDetailClient from './WorldDetailClient';

// Generate static params for all worlds at build time
export function generateStaticParams() {
  return WORLDS.map((world) => ({
    worldId: world.id,
  }));
}

interface WorldDetailPageProps {
  params: { worldId: string };
}

export default function WorldDetailPage({ params }: WorldDetailPageProps) {
  return <WorldDetailClient worldId={params.worldId} />;
}
