import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Bell, CheckCircle2, Flame, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (subject: string, minutesSpent: number) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25 * 60); // 25 mins in seconds
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Distributed Systems');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  // Play a soft pleasant synth chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext might be blocked until user gesture, safely ignore
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#34d399', '#38bdf8', '#c084fc'],
            });
            const minutesDone = Math.round(selectedDuration / 60);
            onSessionComplete(selectedSubject, minutesDone);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, selectedDuration, selectedSubject]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = (selectedDuration - timeLeft) / selectedDuration;

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
  };

  const setTimerPreset = (minutes: number) => {
    const secs = minutes * 60;
    setSelectedDuration(secs);
    setTimeLeft(secs);
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0e101a] border border-cyan-500/30 rounded-3xl p-6 shadow-[0_0_35px_rgba(56,189,248,0.25)] relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Flame className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Neon Focus Session
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Deep work sprint with ambient focus
        </p>

        {/* Preset Selector */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            { label: '25m Sprint', mins: 25 },
            { label: '45m Deep', mins: 45 },
            { label: '15m Review', mins: 15 },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => setTimerPreset(preset.mins)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedDuration === preset.mins * 60
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Glowing Circular Timer Ring */}
        <div className="relative w-52 h-52 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="86"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="104"
              cy="104"
              r="86"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 86}
              strokeDashoffset={(1 - progressRatio) * 2 * Math.PI * 86}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              {formattedTime}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {isRunning ? 'Focus in progress...' : timeLeft === 0 ? 'Session Complete!' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Subject Picker */}
        <div className="mb-6 text-left">
          <label className="block text-[11px] font-medium text-slate-400 mb-1 px-1">
            Focus Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="Distributed Systems">Distributed Systems (CS 401)</option>
            <option value="Artificial Intelligence">Artificial Intelligence (CS 480)</option>
            <option value="Discrete Mathematics">Discrete Mathematics (MATH 210)</option>
            <option value="Compiler Design">Compiler Design (CS 430)</option>
            <option value="Database Systems">Database Systems (CS 350)</option>
          </select>
        </div>

        {/* Timer Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-95 transition-all"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
            title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
