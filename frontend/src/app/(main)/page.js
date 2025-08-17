"use client";
import { useState, useEffect } from "react";
import RecentBlogPosts from "../components/recentBlogs";
import Link from "next/link";

const codeSnippets = [
  "const app = express();",
  "import React from 'react';",
  "async function fetchData() {",
  "git commit -m 'feature: add'",
  "docker build -t myapp .",
];

const stats = [
  { number: "200+", label: "Guides" },
  { number: "50+", label: "Tutorials" },
  { number: "25k+", label: "Developers" },
  { number: "95%", label: "Success Rate" },
];

const HeroSection = () => {
  const [currentCode, setCurrentCode] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentCode((prev) => (prev + 1) % codeSnippets.length),
      2200
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="min-h-[70vh] flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-blue-900 px-4 py-20">
        {/* Title */}
        <div className="max-w-2xl w-full text-center mx-auto">
          <span className="inline-block px-3 py-1 mb-5 rounded-full bg-blue-800/10 text-blue-400 text-xs font-medium tracking-wide">
            Fullstack Learning Platform
          </span>
          <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Level Up Your <span className="text-blue-400">Dev Journey</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-xl mb-8">
            Practical guides, real-world code, and tech tips for developers—clear, fresh, and up to date.
          </p>
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Link
              href="/guides"
              className="px-6 py-3 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 transition"
            >
              Browse Guides
            </Link>
          </div>
        </div>
        {/* Minimal Terminal */}
        <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-xl shadow-lg p-6 my-8 mx-auto">
          <div className="flex items-center mb-3 gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-slate-400 font-mono">terminal.js</span>
          </div>
          <div className="font-mono text-blue-400 text-lg min-h-[32px] flex items-center">
            <span>{codeSnippets[currentCode]}</span>
            <span className="text-slate-300 animate-pulse ml-1">|</span>
          </div>
        </div>
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-blue-400">{s.number}</div>
              <div className="text-slate-300 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <RecentBlogPosts />
    </>
  );
};

export default HeroSection;