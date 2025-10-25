export function WeightChart() {
  const weekData = [
    { day: 'Mon', weight: 82.1 },
    { day: 'Tue', weight: 81.8 },
    { day: 'Wed', weight: 81.9 },
    { day: 'Thu', weight: 81.5 },
    { day: 'Fri', weight: 81.4 },
    { day: 'Sat', weight: 81.3 },
    { day: 'Sun', weight: 81.2 },
  ];

  const maxWeight = Math.max(...weekData.map(d => d.weight));
  const minWeight = Math.min(...weekData.map(d => d.weight));
  const range = maxWeight - minWeight;
  const padding = range * 0.2;

  const getY = (weight: number) => {
    const adjustedMax = maxWeight + padding;
    const adjustedMin = minWeight - padding;
    const adjustedRange = adjustedMax - adjustedMin;
    return ((adjustedMax - weight) / adjustedRange) * 100;
  };

  const points = weekData.map((d, i) => ({
    x: (i / (weekData.length - 1)) * 100,
    y: getY(d.weight),
    weight: d.weight,
    day: d.day
  }));

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaPath = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="relative h-32">
      {/* Chart */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#0B2545" strokeWidth="0.3" opacity="0.06" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#0B2545" strokeWidth="0.3" opacity="0.06" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#0B2545" strokeWidth="0.3" opacity="0.06" />
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#area-gradient)"
          opacity="0.3"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#line-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <defs>
          <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5899E2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5899E2" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5899E2" />
            <stop offset="100%" stopColor="#65AFFF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Data points overlay */}
      <div className="absolute inset-0">
        {points.map((point, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`w-2 h-2 rounded-full ${
              index === points.length - 1 
                ? 'bg-[#5899E2] ring-2 ring-[#5899E2]/20 ring-offset-1' 
                : 'bg-white border-2 border-[#5899E2]'
            }`} />
          </div>
        ))}
      </div>

      {/* Day labels */}
      <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-0.5">
        {weekData.map((d, index) => (
          <span 
            key={index} 
            className={`text-[9px] tracking-wide uppercase ${
              index === weekData.length - 1 ? 'text-[#5899E2]' : 'text-[#0B2545]/50'
            }`}
          >
            {d.day.substring(0, 1)}
          </span>
        ))}
      </div>

      {/* Weight indicators */}
      <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between text-[9px] text-[#0B2545]/50">
        <span>{maxWeight.toFixed(1)}</span>
        <span>{minWeight.toFixed(1)}</span>
      </div>
    </div>
  );
}
