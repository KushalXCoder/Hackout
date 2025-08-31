import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-800/80 bg-gray-900/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-teal-400/90 shadow-[0_0_16px_#2dd4bf]"></span>
          <span className="font-medium text-gray-200">Coastal Dashboard</span>
          <span className="hidden sm:inline text-gray-500">•</span>
          <span className="text-gray-400">Monitoring coasts, simply.</span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-400">
          <Link href="/" className="hover:text-gray-200 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-gray-200 transition-colors">About</Link>
          <Link href="/docs" className="hover:text-gray-200 transition-colors">Docs</Link>
          <Link href="/privacy" className="hover:text-gray-200 transition-colors">Privacy</Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-gray-500">
          © {year} Coastal Dashboard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}