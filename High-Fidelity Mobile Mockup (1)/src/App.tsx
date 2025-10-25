import { MetricCard } from './components/MetricCard';
import { WeightChart } from './components/WeightChart';
import { ConsistencyIndicator } from './components/ConsistencyIndicator';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';
import { TrendingDown, Sparkles, Scale, Percent, Dumbbell, Beef, Droplets, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#F0F1F2] flex items-center justify-center p-8">
      {/* iPhone Frame */}
      <div className="relative">
        {/* Device frame */}
        <div className="w-[390px] bg-[#1a1a1a] rounded-[55px] p-3 shadow-2xl">
          {/* Screen bezel */}
          <div className="bg-white rounded-[48px] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1a1a1a] rounded-b-3xl z-50" />
            
            {/* Scrollable content - Extended height to show two scroll heights */}
            <div className="h-[1600px] bg-[#FAFBFC] overflow-hidden">
              <div className="relative">
                
                {/* Hero Section */}
                <Hero />

                {/* This Week Section - Main Content */}
                <div className="pt-6">
                  {/* Section Header */}
                  <div className="px-6 pb-3">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-[#0B2545] tracking-[-0.02em]">This week</h2>
                      <div className="flex-1 h-[1px] bg-gradient-to-r from-[#5899E2]/15 via-[#5899E2]/5 to-transparent"></div>
                    </div>
                  </div>

                  {/* Weekly Summary */}
                  <div className="px-6 pb-4">
                    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(11,37,69,0.04)] hover:shadow-[0_4px_12px_rgba(11,37,69,0.08)] transition-shadow duration-300 relative overflow-hidden border border-[#0B2545]/8">
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#5899E2]/[0.03] to-transparent rounded-bl-full"></div>
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div>
                          <div className="text-[11px] text-[#0B2545]/40 mb-2.5 uppercase tracking-wide">Weight trend</div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-[26px] h-[26px] rounded-[10px] bg-gradient-to-br from-[#5899E2]/8 to-[#65AFFF]/4 flex items-center justify-center shadow-sm">
                              <TrendingDown className="w-[13px] h-[13px] text-[#5899E2]" strokeWidth={2.5} />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg text-[#5899E2] tracking-tight">-0.6</span>
                              <span className="text-[11px] text-[#0B2545]/40">kg this week</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pl-6 pr-2">
                        <WeightChart />
                      </div>
                      <p className="text-[10px] text-[#0B2545]/45 mt-6 leading-relaxed">
                        Steady downward trend. Your body is responding well to the current approach.
                      </p>
                    </div>
                  </div>

                  {/* Body Composition Overview */}
                  <div className="px-6 pb-4">
                    <div className="text-[11px] text-[#0B2545]/40 mb-3.5 uppercase tracking-wide pl-0.5">Body composition</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <MetricCard
                        label="Weight"
                        value="81.2"
                        unit="kg"
                        change="-7.2 kg"
                        note="Consistent downward trend"
                        icon={Scale}
                        isPositive={true}
                      />
                      <MetricCard
                        label="Body fat"
                        value="18.4"
                        unit="%"
                        change="-4.8%"
                        note="Healthy reduction rate"
                        icon={Percent}
                        isPositive={true}
                      />
                      <MetricCard
                        label="Muscle mass"
                        value="65.8"
                        unit="kg"
                        change="+1.2 kg"
                        note="Building lean tissue"
                        icon={Dumbbell}
                        isPositive={true}
                      />
                      <MetricCard
                        label="Protein"
                        value="17.2"
                        unit="%"
                        change="+0.8%"
                        note="Good protein retention"
                        icon={Beef}
                        isPositive={true}
                      />
                      <MetricCard
                        label="Water"
                        value="58.6"
                        unit="%"
                        change="+1.2%"
                        note="Well hydrated"
                        icon={Droplets}
                        isPositive={true}
                      />
                      <MetricCard
                        label="Visceral fat"
                        value="6"
                        unit="level"
                        change="-3"
                        note="Healthy range"
                        icon={Activity}
                        isPositive={true}
                      />
                    </div>
                  </div>

                  {/* Guidance Section */}
                  <div className="px-6 pb-4">
                    <div className="bg-gradient-to-br from-[#5899E2]/[0.05] to-[#65AFFF]/[0.02] border border-[#5899E2]/15 rounded-[20px] p-4.5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-[14px] h-[14px] text-[#5899E2]" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0B2545] text-xs mb-1.5 tracking-tight">Today's insight</h3>
                          <p className="text-[#0B2545]/50 text-[10px] leading-relaxed">
                            Muscle mass is slightly lower than last measurement. This is normal fluctuation. 
                            Consider taking a rest day to support recovery and adaptation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consistency Tracker */}
                  <div className="px-6 pb-4">
                    <div className="bg-white rounded-[20px] p-4.5 shadow-[0_2px_8px_rgba(11,37,69,0.04)] hover:shadow-[0_4px_12px_rgba(11,37,69,0.08)] transition-shadow duration-300 relative overflow-hidden border border-[#0B2545]/8">
                      {/* Decorative corner accent */}
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#5899E2]/[0.03] to-transparent rounded-tr-full"></div>
                      
                      <div className="flex items-center gap-2.5 mb-3.5">
                        <h3 className="text-[#0B2545] text-xs tracking-tight">Consistency</h3>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#0B2545]/10 to-transparent"></div>
                      </div>
                      <ConsistencyIndicator />
                      <p className="text-[10px] text-[#0B2545]/45 mt-3.5 leading-relaxed">
                        You've logged 5 days this week. Small, regular actions create lasting change.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spacer for navigation */}
                <div className="h-16" />

                {/* Bottom Navigation - Fixed */}
                <div className="absolute bottom-0 left-0 right-0">
                  <BottomNav />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
