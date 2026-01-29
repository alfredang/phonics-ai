'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { ChatBot } from '@/components/chatbot';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <ChatBot />
    </AuthProvider>
  );
}
