'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Map,
  Gamepad2,
  Trophy,
  BarChart3,
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { dailyQuests, levelProgress } = useGameStore();

  const incompleteQuests = dailyQuests.filter((q) => !q.completed).length;

  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      href: '/dashboard/worlds',
      label: 'Worlds',
      icon: <Map className="w-5 h-5" />,
    },
    {
      href: '/dashboard/games',
      label: 'Games',
      icon: <Gamepad2 className="w-5 h-5" />,
    },
    {
      href: '/dashboard/quests',
      label: 'Daily Quests',
      icon: <Target className="w-5 h-5" />,
      badge: incompleteQuests > 0 ? incompleteQuests : undefined,
    },
    {
      href: '/dashboard/achievements',
      label: 'Achievements',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      href: '/dashboard/progress',
      label: 'Progress',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 260,
          x: 0,
        }}
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-gray-100 flex flex-col',
          'lg:translate-x-0 transition-transform',
          sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Logo area spacer (for sticky positioning below TopNav) */}
        <div className="h-16 flex-shrink-0 lg:hidden" />

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto pt-4 lg:pt-20">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarCollapsed(true)}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {/* Icon */}
                <span className="flex-shrink-0">{item.icon}</span>

                {/* Label (hidden when collapsed) */}
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Badge */}
                {item.badge && (
                  <span
                    className={cn(
                      'absolute right-3 min-w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full',
                      isActive(item.href)
                        ? 'bg-white text-purple-600'
                        : 'bg-purple-500 text-white'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Level Progress (desktop only) */}
        {!sidebarCollapsed && (
          <div className="hidden lg:block p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Level Progress</span>
                <span className="text-sm font-bold text-purple-600">
                  {Math.round(levelProgress)}%
                </span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:block p-3 border-t border-gray-100">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
