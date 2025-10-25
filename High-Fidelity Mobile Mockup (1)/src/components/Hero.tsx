import { CircularProgress } from './CircularProgress';

export function Hero() {
  return (
    <div className="relative bg-white rounded-b-[44px] shadow-[0_8px_16px_rgba(11,37,69,0.06)] pb-7 overflow-hidden border-b border-[#0B2545]/5">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 opacity-[0.04] pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5899E2] to-[#65AFFF] blur-3xl"></div>
      </div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#65AFFF] to-[#5899E2] blur-2xl"></div>
      </div>

      {/* Greeting and Progress */}
      <div className="px-6 pt-16 relative z-10">
        <div className="mb-6">
          <h1 className="text-[#0B2545] mb-1.5 tracking-[-0.02em]">Good morning, Alex</h1>
          <p className="text-[#0B2545]/60 text-sm leading-relaxed">
            73% toward your body recomposition goal
          </p>
        </div>

        {/* Progress Circle */}
        <div className="flex justify-center pb-3">
          <div className="relative">
            <CircularProgress percentage={73} size={150} strokeWidth={9} />
            <div className="mt-5 flex items-center justify-between text-[11px] gap-3">
              <div className="flex flex-col items-center flex-1">
                <span className="text-[#0B2545]/40 mb-1 uppercase tracking-wide">Start</span>
                <span className="text-[#0B2545]">88.4</span>
              </div>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#0B2545]/10 to-transparent"></div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-[#0B2545]/40 mb-1 uppercase tracking-wide">Now</span>
                <span className="text-[#0B2545]">81.2</span>
              </div>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#0B2545]/10 to-transparent"></div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-[#0B2545]/40 mb-1 uppercase tracking-wide">Goal</span>
                <span className="text-[#0B2545]">78.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
