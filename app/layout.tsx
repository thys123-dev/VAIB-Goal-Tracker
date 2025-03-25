import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Goal Tracker',
  description: 'Track and achieve your goals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
