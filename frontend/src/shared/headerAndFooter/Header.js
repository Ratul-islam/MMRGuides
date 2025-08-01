import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-purple-600 font-bold text-xl">{"</>"}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-purple-200 transition-colors duration-200 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/guides" className="hover:text-purple-200 transition-colors duration-200 relative group">
              Guides
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
              <Link href="/" className="text-white hover:text-purple-200 transition-colors duration-200">Home</Link>
              <Link href="/guides" className="text-white hover:text-purple-200 transition-colors duration-200">Guides</Link>
              <Link href="/algorithms" className="text-white hover:text-purple-200 transition-colors duration-200">Algorithms</Link>
              <Link href="/problems" className="text-white hover:text-purple-200 transition-colors duration-200">Problems</Link>
              <Link href="/about" className="text-white hover:text-purple-200 transition-colors duration-200">About</Link>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-200 w-full mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;