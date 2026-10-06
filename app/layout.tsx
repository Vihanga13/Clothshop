import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ECOMZ | Premium Contemporary Clothing & Apparel Atelier',
  description:
    'Playful Neo-Brutalist clothing shop featuring 500GSM heavyweight hoodies, organic boxy tees, Okayama Japanese raw denim, tailored trousers, and statement outerwear.',
  keywords: [
    'clothing shop',
    'apparel store',
    'heavyweight hoodies',
    'boxy tees',
    'raw denim',
    'cargo pants',
    'contemporary fashion',
    'neo-brutalist',
    'ecomz',
  ],
  authors: [{ name: 'Ecomz Clothing Atelier' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFD60A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream text-black font-sans selection:bg-neo-yellow selection:text-black">
        {/* Top sticky navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full">{children}</main>

        {/* Global Slide-In Cart Drawer */}
        <CartDrawer />

        {/* Global Neo-Brutalist Toast Notifications */}
        <ToastContainer />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
