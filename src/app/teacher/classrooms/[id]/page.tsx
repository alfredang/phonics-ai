import ClassroomDetailClient from './ClassroomDetailClient';

// Generate a placeholder for static export - actual classroom IDs are loaded client-side
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

interface ClassroomDetailPageProps {
  params: { id: string };
}

export default function ClassroomDetailPage({ params }: ClassroomDetailPageProps) {
  return <ClassroomDetailClient classroomId={params.id} />;
}
