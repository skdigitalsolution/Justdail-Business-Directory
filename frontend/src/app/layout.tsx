import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'LocalFind India | All-India Local Business Discovery & Search Directory',
  description: 'Discover verified local businesses, restaurants, hospitals, services, and professionals across India with LocalFind India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-bg text-brand-navy antialiased flex flex-col justify-between">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
