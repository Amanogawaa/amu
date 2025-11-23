import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/application/AuthContext';
import ReactQueryProvider from '@/provider/ReactQueryProvider';
import { SocketProvider } from '@/provider/SocketProvider';
import { GenerationProvider } from '@/features/create/context/GenerationContext';

import type { Metadata } from 'next';
import { Montserrat, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/provider/ThemeProvider';
import { FloatingGenerationWidget } from '@/features/create/presentation/FloatingGenerationWidget';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <AuthProvider>
              <SocketProvider>
                <GenerationProvider>
                  {children}
                  <FloatingGenerationWidget />
                </GenerationProvider>
              </SocketProvider>
            </AuthProvider>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
