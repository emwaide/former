import { Home, TrendingUp, Plus, Brain, Settings } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { icon: Home, label: 'Index', active: true },
    { icon: TrendingUp, label: 'Trends', active: false },
    { icon: Plus, label: 'Log', active: false },
    { icon: Brain, label: 'Insights', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="bg-white/98 backdrop-blur-xl border-t border-[#0B2545]/8 shadow-sm">
      <div className="px-6 pt-3.5 pb-2">
        <div className="flex items-center justify-between">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center gap-1 flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  item.active ? 'bg-[#5899E2]/8' : ''
                }`}>
                  <Icon 
                    className={`w-[18px] h-[18px] ${
                      item.active ? 'text-[#5899E2]' : 'text-[#0B2545]/35'
                    }`}
                    strokeWidth={item.active ? 2 : 1.5}
                  />
                </div>
                <span className={`text-[10px] tracking-wide ${
                  item.active ? 'text-[#5899E2]' : 'text-[#0B2545]/35'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Home indicator bar for iPhone */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-[#0B2545]/8 rounded-full"></div>
      </div>
    </div>
  );
}
