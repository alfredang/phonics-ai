'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Gamepad2, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function BottomNav() {
  const pathname = usePathname();

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
      href: '/dashboard/achievements',
      label: 'Trophies',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 transition-colors',
                  active ? 'text-purple-600' : 'text-gray-400'
                )}
              >
                {/* Icon container with active indicator */}
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute inset-0 -m-1.5 bg-purple-100 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 p-1.5">{item.icon}</span>
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    active ? 'text-purple-600' : 'text-gray-400'
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
