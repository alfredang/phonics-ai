'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  TrendingUp,
  Clock,
  Settings,
  ChevronRight,
  Shield,
  UserPlus,
  ToggleRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStore } from '@/stores/adminStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { stats, appSettings, fetchStats, fetchAppSettings, isLoading } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchAppSettings();
  }, [fetchStats, fetchAppSettings]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-white/80 text-sm font-medium"
          >
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold mt-1"
          >
            Welcome, {user?.displayName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 mt-2 max-w-md"
          >
            Manage users, configure app settings, and monitor platform activity.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? '--' : stats?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Learners</p>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? '--' : stats?.totalLearners || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teachers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Teachers</p>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? '--' : stats?.totalTeachers || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Classrooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Classrooms</p>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? '--' : stats?.totalClassrooms || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active Today</p>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? '--' : stats?.activeToday || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">New This Week</p>
                  <p className="text-2xl font-bold text-white">
                    {isLoading ? '--' : stats?.newUsersThisWeek || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Registration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    appSettings?.registrationEnabled
                      ? 'bg-gradient-to-br from-green-400 to-green-600'
                      : 'bg-gradient-to-br from-red-400 to-red-600'
                  }`}
                >
                  <ToggleRight className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Registration</p>
                  <p className="text-lg font-bold text-white">
                    {appSettings?.registrationEnabled ? 'Open' : 'Closed'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-blue-400" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-400">
                View, edit, activate/deactivate, or delete user accounts.
              </p>
              <div className="space-y-2">
                <Link href="/admin/users">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 cursor-pointer"
                  >
                    <Users className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="font-medium text-white">View All Users</p>
                      <p className="text-xs text-gray-400">
                        Browse and manage all user accounts
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </Link>
                <Link href="/admin/users?action=create">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20 cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5 text-green-400" />
                    <div className="flex-1">
                      <p className="font-medium text-white">Create User</p>
                      <p className="text-xs text-gray-400">
                        Add a new user account manually
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-purple-400" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-400">
                Configure API keys, toggle registration, and manage features.
              </p>
              <div className="space-y-2">
                <Link href="/admin/settings">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 cursor-pointer"
                  >
                    <Settings className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <p className="font-medium text-white">All Settings</p>
                      <p className="text-xs text-gray-400">
                        Manage all app configuration
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </Link>
                <Link href="/admin/settings#registration">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 cursor-pointer"
                  >
                    <ToggleRight className="w-5 h-5 text-orange-400" />
                    <div className="flex-1">
                      <p className="font-medium text-white">Toggle Registration</p>
                      <p className="text-xs text-gray-400">
                        Enable/disable user sign-ups
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
