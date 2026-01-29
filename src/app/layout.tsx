import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Phonics AI - Learn to Read with Fun!',
  description: 'Interactive phonics learning app for ages 9-15. Master reading through games, challenges, and adventure!',
  keywords: ['phonics', 'reading', 'learning', 'education', 'kids', 'games'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
