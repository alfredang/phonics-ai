'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Key,
  Eye,
  GraduationCap,
  BookOpen,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStore, AdminViewAs } from '@/stores/adminStore';
import { cn } from '@/lib/utils/cn';

interface AdminLayoutProps {
  children: ReactNode;
}

const viewOptions: { value: AdminViewAs; label: string; icon: typeof Shield; color: string; path: string }[] = [
  { value: 'admin', label: 'Admin View', icon: Shield, color: 'text-red-400', path: '/admin' },
  { value: 'learner', label: 'Learner View', icon: GraduationCap, color: 'text-purple-400', path: '/dashboard' },
  { value: 'teacher', label: 'Teacher View', icon: BookOpen, color: 'text-blue-400', path: '/teacher' },
  { value: 'parent', label: 'Parent View', icon: UserCheck, color: 'text-green-400', path: '/parent' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, signOut } = useAuthStore();
  const { viewAs, setViewAs } = useAdminStore();
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  // Redirect unauthenticated users or non-admins
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'admin') {
        // Redirect non-admins to their appropriate dashboard
        if (user?.role === 'teacher') {
          router.push('/teacher');
        } else if (user?.role === 'parent') {
          router.push('/parent');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium">Loading admin portal...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render for unauthenticated users or non-admins
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/admin/users',
      label: 'User Management',
      icon: Users,
    },
    {
      href: '/admin/settings',
      label: 'App Settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    setViewAs('admin'); // Reset view on sign out
    await signOut();
    router.push('/login');
  };

  const handleViewChange = (view: AdminViewAs) => {
    setViewAs(view);
    setShowViewDropdown(false);
    const option = viewOptions.find((o) => o.value === view);
    if (option) {
      router.push(option.path);
    }
  };

  const currentView = viewOptions.find((o) => o.value === viewAs) || viewOptions[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">Admin Portal</h1>
                <p className="text-xs text-gray-400">Phonics AI</p>
              </div>
            </Link>

            {/* View As Dropdown + User Menu */}
            <div className="flex items-center gap-4">
              {/* View As Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowViewDropdown(!showViewDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">View As:</span>
                  <span className={cn('text-sm font-medium', currentView.color)}>
                    {currentView.label.replace(' View', '')}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-gray-400 transition-transform',
                      showViewDropdown && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showViewDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      {viewOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleViewChange(option.value)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors',
                              viewAs === option.value && 'bg-gray-700/50'
                            )}
                          >
                            <Icon className={cn('w-4 h-4', option.color)} />
                            <span className="text-sm text-gray-200">{option.label}</span>
                            {viewAs === option.value && (
                              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-sm text-gray-300">
                <span className="font-medium text-white">{user?.displayName}</span>
                <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                  Admin
                </span>
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-gray-900/50 border-r border-gray-700 p-4 hidden lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    active
                      ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Quick Info */}
          <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">Admin Access</span>
            </div>
            <p className="text-xs text-gray-400">
              You have full administrative privileges. Handle user data with care.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
