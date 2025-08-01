"use client"
import { useState, useEffect } from 'react';
import RecentBlogPosts from '../components/recentBlogs';

const HeroSection = () => {
  const [currentCode, setCurrentCode] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const codeSnippets = [
    "const app = express();",
    "import React from 'react';",
    "async function fetchData() {",
    "git commit -m 'feature: add'",
    "docker build -t myapp .",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentCode((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "200+", label: "Developer Guides", icon: "📖" },
    { number: "50+", label: "Tech Tutorials", icon: "💻" },
    { number: "25k+", label: "Developers Helped", icon: "👨‍💻" },
    { number: "95%", label: "Success Rate", icon: "🚀" },
  ];

  return (
    <>
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center min-h-screen">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            New: Full-Stack Development Guide Available
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              Modern
            </span>
            <span className="block text-4xl md:text-6xl">Development</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            From beginner to expert with comprehensive guides, real-world projects, 
            and cutting-edge techniques. Join thousands of successful developers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold text-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10 flex items-center justify-center">
                🚀 Start Learning
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            
            <button className="group px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-full font-semibold text-lg hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center">
                📚 Browse Guides
                <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
            </button>
          </div>

        </div>

        {/* Right Content - Code Terminal */}
        <div className="lg:w-1/2 lg:pl-12">
          <div className="relative">
            {/* Terminal Window */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between bg-gray-800/90 px-6 py-4 border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 text-sm font-mono">modern_app.js</div>
                <div className="text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm">
                <div className="text-green-400 mb-4">
                  $ npm run dev
                </div>
                
                {/* Animated Code */}
                <div className="space-y-2 mb-6">
                  <div className="text-purple-400">Modern Web Development</div>
                  <div className="text-blue-400">
                    <span className={`${isTyping ? 'animate-pulse' : ''}`}>
                      {codeSnippets[currentCode]}
                      <span className="animate-pulse">|</span>
                    </span>
                  </div>
                  <div className="text-gray-500">    {'//'} Building amazing apps</div>
                  <div className="text-yellow-400">    export default App;</div>
                </div>

                {/* Output */}
                <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-green-400">
                  <div className="text-green-400 text-xs mb-2">DEVELOPMENT SERVER:</div>
                  <div className="text-white">✅ Server running on port 3000</div>
                  <div className="text-white">✅ Hot reload enabled</div>
                  <div className="text-white">✅ TypeScript compilation successful</div>
                  <div className="text-green-400 font-bold mt-2">
                    🎉 App ready at http://localhost:3000
                  </div>
                </div>

                {/* Cursor */}
                <div className="flex items-center mt-4">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="w-2 h-4 bg-green-400 animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-blue-500 rounded-full animate-pulse opacity-60"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
    <RecentBlogPosts/>
    </>
  );
};

export default HeroSection;