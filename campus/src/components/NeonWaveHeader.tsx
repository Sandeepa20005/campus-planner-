import React from 'react';
import { Sparkles, Moon, Sun, Clock, Plus } from 'lucide-react';
import { ThemeMode } from '../types';

interface NeonWaveHeaderProps {
  themeMode: ThemeMode;
  isNightTime: boolean;
  onCycleTheme: () => void;
  onOpenAddModal: () => void;
}

export const NeonWaveHeader: React.FC<NeonWaveHeaderProps> = ({
  themeMode,
  isNightTime,
  onCycleTheme,
  onOpenAddModal,
}) => {
  return (
    <header className="relative pt-3 pb-4 px-5 text-center flex flex-col items-center">
      {/* Top utility row */}
      <div className="w-full flex items-center justify-between mb-2">
        {/* Theme mode pill */}
        <button
          onClick={onCycleTheme}
          title="Toggle Theme (Auto / Dark / Light)"
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 glass-pill hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white"
        >
          {themeMode === 'auto' ? (
            <>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Auto {isNightTime ? '(Night)' : '(Day)'}</span>
            </>
          ) : themeMode === 'dark' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              <span>Dark Neon</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-700 dark:text-slate-300">Light Glass</span>
            </>
          )}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all duration-200 active:scale-95 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Plan</span>
        </button>
      </div>

      {/* Main Title */}
      <h1 className="text-lg md:text-xl font-bold tracking-[0.18em] text-white uppercase select-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
        Campus &amp; Study Planner
      </h1>

      {/* Signature Fluid Neon Curved Wave & Particle Trail */}
      <div className="relative w-full max-w-[280px] h-10 -mt-1 pointer-events-none select-none">
        <svg
          viewBox="0 0 280 40"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neonWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.4" />
            </linearGradient>

            <filter id="neonGlowEffect" x="-20%" y="-40%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ambient Glow Line */}
          <path
            d="M 12 24 C 60 8, 110 32, 175 14 C 220 2, 255 18, 270 12"
            stroke="url(#neonWaveGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonGlowEffect)"
            opacity="0.8"
          />

          {/* Crisp Core Foreground Line */}
          <path
            d="M 12 24 C 60 8, 110 32, 175 14 C 220 2, 255 18, 270 12"
            stroke="url(#neonWaveGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Glowing Head Stardust Orb */}
          <circle cx="12" cy="24" r="3" fill="#a7f3d0" filter="url(#neonGlowEffect)" />
          <circle cx="12" cy="24" r="1.5" fill="#ffffff" />

          {/* Trailing Soft Particle Sparkles */}
          <circle cx="95" cy="22" r="1.2" fill="#38bdf8" opacity="0.8" />
          <circle cx="190" cy="9" r="1.2" fill="#e9d5ff" opacity="0.9" />
          <circle cx="268" cy="12" r="2" fill="#c084fc" opacity="0.75" />
        </svg>
      </div>
    </header>
  );
};
