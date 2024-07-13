import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NextAuthProvider from '@/providers/NextAuth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My-News',
  description: 'A news app built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <head>
        <link rel='manifest' href='../public/manifest.json' />
        <link rel='apple-touch-icon' href='../public/icon.png'></link>
      </head>
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
