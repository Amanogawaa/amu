'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-winter-teal to-evergreen-dusk rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold text-evergreen-dusk">Amu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-custom-foreground hover:text-winter-teal transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-custom-foreground hover:text-winter-teal transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/signin"
              className="text-custom-foreground hover:text-winter-teal transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="#cta"
              className="bg-gradient-to-r from-winter-teal to-evergreen-dusk text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all transform hover:scale-105 font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6 text-custom-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-custom-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-custom-foreground hover:text-winter-teal hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-custom-foreground hover:text-winter-teal hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-custom-foreground hover:text-winter-teal hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="#cta"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-gradient-to-r from-winter-teal to-evergreen-dusk text-white px-6 py-3 rounded-full font-semibold shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
