import type { Metadata } from "next";
import { Montserrat, Poppins, Roboto, Manrope, Inter } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { cn } from "@/src/lib/utils";
import ConvexClientProvider from "@/src/provider/ConvexProvider";
import { AuthProvider } from "../context/AuthContext";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "CourseCraft",
  description: "Your personal AI assistant for all things CourseCraft",
  icons: {
    icon: "/coursecraft.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        className={cn(
          poppins.variable,
          "font-sans",
          roboto.variable,
          interHeading.variable,
        )}
      >
        <body
          className={`${poppins.variable} ${montserrat.variable} font-sans antialiased`}
        >
          <ConvexClientProvider>
            <AuthProvider>{children}</AuthProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
