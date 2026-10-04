import React from 'react';
import { Radio } from 'lucide-react';

interface NeonFocusRingProps {
  progressPercentage: number; // e.g. 75
  completedTasks: number; // e.g. 6
  totalTasks: number; // e.g. 8
  onClickRing?: () => void;
}

export const NeonFocusRing: React.FC<NeonFocusRingProps> = ({
  progressPercentage = 75,
  completedTasks = 6,
  totalTasks = 8,
  onClickRing,
}) => {
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Offset to calculate stroke progress
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center my-2 select-none">
      {/* Outer ambient blur halo */}
      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-purple-500/25 blur-2xl pointer-events-none -z-10" />

      {/* Interactive Ring Container */}
      <button
        type="button"
        onClick={onClickRing}
        className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full transition-transform active:scale-95 duration-200"
        title="Tap to view focus stats or start study timer"
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 overflow-visible"
        >
          <defs>
            {/* Luminous Neon Gradient */}
            <linearGradient id="focusNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="90%" stopColor="#c084fc" />
            </linearGradient>

            {/* Glowing Drop Filter */}
            <filter id="ringNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur1" />
              <feGaussianBlur stdDeviation="10" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
            fill="rgba(14, 16, 26, 0.65)"
            strokeLinecap="round"
          />

          {/* Active Glowing Neon Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#focusNeonGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            filter="url(#ringNeonGlow)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Crisp sharp line over the glow for high definition */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#focusNeonGrad)"
            strokeWidth={strokeWidth - 4}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <span className="text-[13px] font-medium text-slate-300 tracking-wide">
            Today's Focus
          </span>

          {/* Soundwave + Percentage badge */}
          <div className="flex items-center gap-2 my-0.5">
            {/* Left Soundwave Bars */}
            <div className="flex items-center gap-[3px] text-emerald-400 opacity-90">
              <span className="w-[2.5px] h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-[2.5px] h-4 bg-emerald-400 rounded-full" />
              <span className="w-[2.5px] h-2 bg-emerald-400 rounded-full" />
            </div>

            <span className="text-2xl font-bold tracking-tight text-white font-mono drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              {progressPercentage}%
            </span>

            {/* Right Soundwave Bars */}
            <div className="flex items-center gap-[3px] text-purple-400 opacity-90">
              <span className="w-[2.5px] h-2 bg-purple-400 rounded-full" />
              <span className="w-[2.5px] h-4 bg-purple-400 rounded-full" />
              <span className="w-[2.5px] h-2.5 bg-purple-400 rounded-full animate-pulse" />
            </div>
          </div>

          <span className="text-xs text-slate-400 font-normal">
            Complete
          </span>
        </div>
      </button>

      {/* Subtitle Footer */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <span>Tasks Tracked:</span>
        <span className="font-semibold font-mono text-white text-sm bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
          {completedTasks}/{totalTasks}
        </span>
      </div>
    </div>
  );
};
