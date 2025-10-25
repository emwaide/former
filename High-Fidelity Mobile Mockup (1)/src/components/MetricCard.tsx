import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  change: string;
  note: string;
  icon: LucideIcon;
  isPositive?: boolean;
}

export function MetricCard({ 
  label, 
  value, 
  unit, 
  change, 
  note,
  icon: Icon,
  isPositive = true 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-[0_2px_8px_rgba(11,37,69,0.04)] hover:shadow-[0_4px_12px_rgba(11,37,69,0.08)] transition-all duration-300 hover:scale-[1.01] border border-[#0B2545]/8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-[#0B2545]/40 uppercase tracking-wide">{label}</span>
        <div className="w-[26px] h-[26px] rounded-[10px] bg-gradient-to-br from-[#5899E2]/8 to-[#65AFFF]/4 flex items-center justify-center">
          <Icon className="w-[13px] h-[13px] text-[#5899E2]" strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1.5">
        <span className="text-[26px] text-[#0B2545] tracking-tight leading-none">{value}</span>
        <span className="text-[11px] text-[#0B2545]/40">{unit}</span>
      </div>
      <div className={`text-[11px] mb-2 font-medium ${isPositive ? 'text-[#5899E2]' : 'text-[#0B2545]/50'}`}>
        {change}
      </div>
      <div className="text-[10px] text-[#0B2545]/45 leading-relaxed">{note}</div>
    </div>
  );
}
