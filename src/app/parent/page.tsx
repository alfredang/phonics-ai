'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Flame,
  Award,
  Plus,
  ChevronRight,
  Link2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useParentStore } from '@/stores/parentStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export default function ParentDashboardPage() {
  const { user } = useAuthStore();
  const { children, fetchChildren, linkChild, isLoading, error } = useParentStore();

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchChildren(user.uid);
    }
  }, [user?.uid, fetchChildren]);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !linkCode.trim()) return;

    setIsLinking(true);
    setLinkError(null);
    setLinkSuccess(false);

    try {
      await linkChild(user.uid, user.displayName, linkCode.trim().toUpperCase());
      setLinkSuccess(true);
      setLinkCode('');
      // Refresh children list
      await fetchChildren(user.uid);
    } catch (err: unknown) {
      setLinkError(err instanceof Error ? err.message : 'Failed to link child');
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm font-medium"
            >
              Parent Dashboard
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold mt-1"
            >
              Welcome, {user?.displayName}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 mt-2 max-w-md"
            >
              Track your children&apos;s phonics learning progress and celebrate
              their achievements.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Link2 className="w-5 h-5" />}
              className="shadow-xl"
              onClick={() => setShowLinkModal(true)}
            >
              Link Child
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Children Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading children...</p>
        </div>
      ) : children.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/parent/children/${child.childId}`}>
                <Card className="bg-white/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                        {child.childDisplayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {child.childDisplayName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Linked {new Date(child.linkedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Level</p>
                        <p className="font-bold text-gray-800">--</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Streak</p>
                        <p className="font-bold text-gray-800">--</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">XP</p>
                        <p className="font-bold text-gray-800">--</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                      View Progress <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}

          {/* Add Child Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: children.length * 0.05 }}
          >
            <Card
              className="bg-white/50 backdrop-blur border-dashed border-2 border-gray-300 hover:border-green-400 hover:bg-white/80 transition-all cursor-pointer h-full"
              onClick={() => setShowLinkModal(true)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[240px]">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-green-500" />
                </div>
                <p className="font-medium text-gray-800">Link Another Child</p>
                <p className="text-sm text-gray-500 text-center mt-1">
                  Enter their link code to connect
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Link Your Child&apos;s Account
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Ask your child to generate a link code in their Settings page, then
              enter it here to connect their account and track their progress.
            </p>
            <Button
              variant="primary"
              leftIcon={<Link2 className="w-5 h-5" />}
              onClick={() => setShowLinkModal(true)}
            >
              Link Child Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800">How to Link Your Child</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-green-700">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800 flex-shrink-0">
                  1
                </span>
                <span>
                  Have your child log in to their Phonics AI account
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800 flex-shrink-0">
                  2
                </span>
                <span>
                  They should go to Settings &gt; Parent Link and click
                  &quot;Generate Link Code&quot;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800 flex-shrink-0">
                  3
                </span>
                <span>
                  Enter the 8-character code they give you in the Link Child form
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800 flex-shrink-0">
                  4
                </span>
                <span>
                  Your child will need to approve the link request in their account
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      {/* Link Child Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => {
          setShowLinkModal(false);
          setLinkCode('');
          setLinkError(null);
          setLinkSuccess(false);
        }}
        title="Link Child Account"
      >
        <form onSubmit={handleLinkChild} className="space-y-4">
          {linkError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {linkError}
            </div>
          )}

          {linkSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              Link request sent! Your child will need to approve it in their
              account.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Code
            </label>
            <input
              type="text"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
              placeholder="Enter 8-character code"
              maxLength={8}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none font-mono text-center text-2xl tracking-widest uppercase"
            />
            <p className="text-xs text-gray-500 mt-2">
              Ask your child to generate this code in their Settings
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowLinkModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isLinking}
              disabled={linkCode.length !== 8}
            >
              Link Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
