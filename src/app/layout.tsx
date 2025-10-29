import { AuthProvider } from '@/features/auth/application/AuthContext';
import type { Metadata } from 'next';
import { Inter, Montserrat, Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/provider/ReactQueryProvider';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Amu AI',
  description: 'Your personal AI assistant for all things Amu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
