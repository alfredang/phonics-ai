'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Users,
  Copy,
  Check,
  MoreVertical,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTeacherStore } from '@/stores/teacherStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { CreateClassroomInput } from '@/types/classroom';

export default function ClassroomsPage() {
  const { user } = useAuthStore();
  const {
    classrooms,
    fetchClassrooms,
    createClassroom,
    deleteClassroom,
    regenerateJoinCode,
    isLoading,
    error,
  } = useTeacherStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchClassrooms(user.uid);
    }
  }, [user?.uid, fetchClassrooms]);

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !newClassName.trim()) return;

    setIsCreating(true);
    try {
      const input: CreateClassroomInput = {
        name: newClassName.trim(),
        description: newClassDescription.trim() || undefined,
      };
      await createClassroom(user.uid, user.displayName, input);
      setShowCreateModal(false);
      setNewClassName('');
      setNewClassDescription('');
    } catch {
      // Error handled by store
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRegenerateCode = async (classroomId: string) => {
    try {
      await regenerateJoinCode(classroomId);
    } catch {
      // Error handled by store
    }
  };

  const handleDeleteClassroom = async (classroomId: string) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await deleteClassroom(classroomId);
      } catch {
        // Error handled by store
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Classrooms</h1>
          <p className="text-gray-600 mt-1">
            Manage your classrooms and invite students
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setShowCreateModal(true)}
        >
          New Classroom
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Classrooms Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading classrooms...</p>
        </div>
      ) : classrooms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom, index) => (
            <motion.div
              key={classroom.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/80 backdrop-blur hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{classroom.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {classroom.studentCount} student
                          {classroom.studentCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px] hidden group-hover:block z-10">
                        <button
                          onClick={() => handleRegenerateCode(classroom.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                          New Join Code
                        </button>
                        <button
                          onClick={() => handleDeleteClassroom(classroom.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {classroom.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {classroom.description}
                    </p>
                  )}

                  {/* Join Code */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-2">Join Code</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-2xl font-mono font-bold text-blue-600 tracking-wider">
                        {classroom.joinCode}
                      </code>
                      <button
                        onClick={() => handleCopyCode(classroom.joinCode)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copiedCode === classroom.joinCode ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Share this code with students to join
                    </p>
                  </div>

                  {/* View Classroom Link */}
                  <Link href={`/teacher/classrooms/${classroom.id}`}>
                    <Button variant="outline" className="w-full mt-4">
                      View Students
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Plus className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Create Your First Classroom
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Create a classroom and share the join code with your students so
              they can start learning phonics with you.
            </p>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Classroom
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Classroom Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Classroom"
      >
        <form onSubmit={handleCreateClassroom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classroom Name *
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g., Grade 4 - Section A"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={newClassDescription}
              onChange={(e) => setNewClassDescription(e.target.value)}
              placeholder="Add a description for your classroom..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isCreating}
            >
              Create Classroom
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
