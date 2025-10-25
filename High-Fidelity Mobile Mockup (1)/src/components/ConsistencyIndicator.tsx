export function ConsistencyIndicator() {
  const days = [
    { logged: true },
    { logged: true },
    { logged: false },
    { logged: true },
    { logged: true },
    { logged: true },
    { logged: false },
  ];

  const loggedCount = days.filter(d => d.logged).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#0B2545]/50">This week</span>
        <span className="text-xs text-[#5899E2]">{loggedCount} of 7 days</span>
      </div>
      <div className="flex gap-1.5">
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full transition-all duration-500 ${
              day.logged 
                ? 'bg-gradient-to-r from-[#5899E2] to-[#65AFFF]' 
                : 'bg-[#0B2545]/8'
            }`}
            style={{ 
              transitionDelay: `${index * 50}ms`,
              boxShadow: day.logged ? '0 1px 3px rgba(88, 153, 226, 0.25)' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
