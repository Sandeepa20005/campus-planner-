import React from 'react';
import { LayoutDashboard, Calendar, Target, BarChart2, Timer } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenTimer: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenTimer,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Planner', icon: LayoutDashboard },
    { id: 'calendar' as ActiveTab, label: 'Calendar', icon: Calendar },
    { id: 'priorities' as ActiveTab, label: 'Priorities', icon: Target },
    { id: 'tracker' as ActiveTab, label: 'Analytics', icon: BarChart2 },
    { id: 'timer' as ActiveTab, label: 'Focus', icon: Timer, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto bg-[#0a0c14]/90 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 transition-all">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.isAction) {
                  onOpenTimer();
                } else {
                  onTabChange(item.id);
                }
              }}
              className="group flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-90"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    item.isAction
                      ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : isActive
                      ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {isActive && !item.isAction && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                )}
              </div>

              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  item.isAction
                    ? 'text-emerald-400 font-semibold'
                    : isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
