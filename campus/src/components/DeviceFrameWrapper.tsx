import React, { useState } from 'react';
import { Smartphone, Monitor, Moon, Sun, Sparkles, Wifi, BatteryMedium, Signal } from 'lucide-react';
import { ThemeMode } from '../types';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  themeMode: ThemeMode;
  onCycleTheme: () => void;
  onResetData: () => void;
  onTriggerConfetti: () => void;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  themeMode,
  onCycleTheme,
  onResetData,
  onTriggerConfetti,
}) => {
  const [usePhoneFrame, setUsePhoneFrame] = useState(true);

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 selection:bg-emerald-500/30">
      {/* Top Controls Toolbar */}
      <div className="w-full max-w-[430px] sm:max-w-2xl px-4 py-2.5 mb-2 flex items-center justify-between text-xs border-b border-white/5 sm:border sm:rounded-2xl sm:bg-[#0f111a]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <button
            onClick={() => setUsePhoneFrame(!usePhoneFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Toggle between iPhone frame and fluid view"
          >
            {usePhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Expanded View</span>
                <span className="sm:hidden">Full</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">iPhone 16 Frame</span>
                <span className="sm:hidden">iPhone</span>
              </>
            )}
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={onCycleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Switch Theme"
          >
            {themeMode === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span className="capitalize">{themeMode}</span>
          </button>
        </div>

        {/* Quick Demo Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerConfetti}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-all"
            title="Celebrate completed goal"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sparkles</span>
          </button>
          <button
            onClick={onResetData}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all"
            title="Reset to default mock data"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Container */}
      {usePhoneFrame ? (
        /* Realistic iPhone 16 Pro Bezel Frame */
        <div className="relative w-full max-w-[400px] h-[860px] sm:h-[844px] bg-[#000000] sm:rounded-[52px] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(168,85,247,0.15)] border-0 sm:border-[8px] sm:border-[#2a2933] overflow-hidden flex flex-col ring-1 ring-white/15">
          {/* iOS Top Status Bar matching screenshot (3:55, 4G, 94%) */}
          <div className="w-full pt-3 px-7 flex items-center justify-between text-xs text-white z-30 select-none bg-transparent shrink-0">
            <span className="font-semibold tracking-tight text-[13px] font-mono">3:55</span>

            {/* Apple Dynamic Island */}
            <div className="relative w-28 h-6 bg-black rounded-full border border-white/10 flex items-center justify-center px-2 cursor-pointer transition-all hover:w-36 group">
              {/* Camera sensor dot */}
              <div className="absolute right-3 w-2.5 h-2.5 rounded-full bg-[#0a0a0f] border border-white/20" />
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 opacity-90 group-hover:opacity-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium truncate">Focus Active</span>
              </div>
            </div>

            {/* Signal & Battery Status */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-200">
              <Signal className="w-3.5 h-3.5" />
              <span className="font-semibold text-[10px]">4G</span>
              <div className="flex items-center gap-0.5 border border-white/60 rounded px-1 py-0.5 text-[9px] font-bold">
                94
              </div>
            </div>
          </div>

          {/* App Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
            {children}
          </div>

          {/* iOS Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none z-50" />
        </div>
      ) : (
        /* Fullscreen Responsive Mode */
        <div className="w-full max-w-xl mx-auto bg-[#0a0c14] border-x border-white/10 min-h-screen relative pb-24 shadow-2xl">
          {children}
        </div>
      )}
    </div>
  );
};
