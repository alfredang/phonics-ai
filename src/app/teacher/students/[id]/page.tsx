import StudentProgressClient from './StudentProgressClient';

// Generate a placeholder for static export - actual student IDs are loaded client-side
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

interface StudentProgressPageProps {
  params: { id: string };
}

export default function StudentProgressPage({ params }: StudentProgressPageProps) {
  return <StudentProgressClient studentId={params.id} />;
}
