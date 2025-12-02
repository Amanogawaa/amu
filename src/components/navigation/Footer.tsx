import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-custom-foreground text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-2xl font-bold mb-4 text-primary">CourseCraft</p>
          <p className="text-sm text-gray-300">
            Built by Dominic Molino • CSP411 Project • March 2025
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Powered by AI • Made for First-Year Coders
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <Link
            href="/terms"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            Terms & Conditions
          </Link>
          <span className="text-gray-600">•</span>
          <Link
            href="/privacy"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-600">•</span>
          <Link
            href="/about"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            About
          </Link>
          <span className="text-gray-600">•</span>
          <Link
            href="/glossary"
            className="text-gray-300 hover:text-primary transition-colors"
          >
            Glossary
          </Link>
        </div>
      </div>
    </footer>
  );
}
