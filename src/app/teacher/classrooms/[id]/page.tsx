'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Copy,
  Check,
  RefreshCw,
  UserX,
  TrendingUp,
  Flame,
  Star,
  Clock,
  ChevronRight,
  BookOpen,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTeacherStore } from '@/stores/teacherStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils/cn';

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classroomId = params.id as string;

  const { user } = useAuthStore();
  const {
    selectedClassroom,
    students,
    selectClassroom,
    fetchStudents,
    regenerateJoinCode,
    removeStudent,
    updateClassroom,
    isLoading,
    error,
  } = useTeacherStore();

  const [copiedCode, setCopiedCode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null);

  useEffect(() => {
    if (classroomId) {
      selectClassroom(classroomId);
    }
  }, [classroomId, selectClassroom]);

  useEffect(() => {
    if (selectedClassroom) {
      setEditName(selectedClassroom.name);
      setEditDescription(selectedClassroom.description || '');
    }
  }, [selectedClassroom]);

  const handleCopyCode = async () => {
    if (selectedClassroom?.joinCode) {
      await navigator.clipboard.writeText(selectedClassroom.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRegenerateCode = async () => {
    if (selectedClassroom?.id) {
      await regenerateJoinCode(selectedClassroom.id);
    }
  };

  const handleSaveSettings = async () => {
    if (!selectedClassroom?.id) return;
    setIsSaving(true);
    try {
      await updateClassroom(selectedClassroom.id, {
        name: editName,
        description: editDescription || undefined,
      });
      setShowSettingsModal(false);
    } catch {
      // Error handled by store
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveStudent = async () => {
    if (!selectedClassroom?.id || !studentToRemove) return;
    try {
      await removeStudent(selectedClassroom.id, studentToRemove);
      setStudentToRemove(null);
    } catch {
      // Error handled by store
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading && !selectedClassroom) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (!selectedClassroom) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Classroom not found</p>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/classrooms">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedClassroom.name}</h1>
            {selectedClassroom.description && (
              <p className="text-gray-500">{selectedClassroom.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          leftIcon={<Settings className="w-4 h-4" />}
          onClick={() => setShowSettingsModal(true)}
        >
          Settings
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Code */}
        <Card className="bg-white/80 backdrop-blur col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Join Code</p>
                <div className="flex items-center gap-2">
                  <code className="text-xl font-mono font-bold text-indigo-600 tracking-wider">
                    {selectedClassroom.joinCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy code"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleRegenerateCode}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Generate new code"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Progress (placeholder) */}
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Level</p>
                <p className="text-2xl font-bold text-gray-800">
                  {students.length > 0
                    ? Math.round(students.reduce((sum, s) => sum + s.level, 0) / students.length)
                    : '--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Today (placeholder) */}
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Today</p>
                <p className="text-2xl font-bold text-gray-800">
                  {students.filter((s) => {
                    if (!s.lastActivityAt) return false;
                    const today = new Date().toDateString();
                    return new Date(s.lastActivityAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Student
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                      Level
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                      XP
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                      Streak
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                      Lessons
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                      Last Active
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <motion.tr
                      key={student.userId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {student.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {student.displayName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Joined {formatDate(student.joinedAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          <Star className="w-3 h-3" />
                          {student.level}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium text-gray-800">
                          {student.xp.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Flame
                            className={cn(
                              'w-4 h-4',
                              student.currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'
                            )}
                          />
                          <span className="font-medium text-gray-800">
                            {student.currentStreak}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium text-gray-800">
                          {student.lessonsCompleted}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-3 h-3" />
                          {formatDate(student.lastActivityAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/teacher/students/${student.userId}`}>
                            <Button variant="ghost" size="sm">
                              View <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                          <button
                            onClick={() => setStudentToRemove(student.userId)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove student"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">No students yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Share the join code <strong>{selectedClassroom.joinCode}</strong> with your
                students so they can join this classroom.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Classroom Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classroom Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSaveSettings}
              isLoading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Student Confirmation Modal */}
      <Modal
        isOpen={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        title="Remove Student"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to remove this student from the classroom? They will need
            to rejoin using the join code.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStudentToRemove(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleRemoveStudent}
            >
              Remove Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
