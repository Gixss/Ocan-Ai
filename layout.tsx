import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ocan AI — Created by Gixss',
  description: 'Modern AI Assistant powered by Ocan AI v1.0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}