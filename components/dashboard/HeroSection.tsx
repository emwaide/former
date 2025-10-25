import { Fragment, ReactNode, useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const withAlpha = (color: string, alpha: number) => {
  if (color.startsWith('rgb')) {
    const values = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((value) => parseFloat(value.trim()));
    const [r = 0, g = 0, b = 0] = values.slice(0, 3);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const sanitized = color.replace('#', '');
  const expanded =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((char) => char + char)
          .join('')
      : sanitized;
  const bigint = parseInt(expanded, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
  accentGradient: [string, string];
  trackColor: string;
};

const ProgressRing = ({
  progress,
  size = 160,
  strokeWidth = 12,
  children,
  accentGradient,
  trackColor,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = clamp(progress);
  const strokeDashoffset = circumference * (1 - clamped);
  const gradientId = useMemo(() => `ringGradient-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <View className="relative items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={accentGradient[0]} stopOpacity={1} />
            <Stop offset="100%" stopColor={accentGradient[1]} stopOpacity={1} />
          </SvgGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">{children}</View>
    </View>
  );
};

type HeroSectionProps = {
  name: string;
  startLabel: string;
  currentLabel: string;
  goalLabel: string;
  progressFraction: number;
  topInset?: number;
  children?: ReactNode;
};

const RING_GRADIENT: [string, string] = ['#37D0B4', '#42E2B8'];

export const HeroSection = ({
  name,
  startLabel,
  currentLabel,
  goalLabel,
  progressFraction,
  topInset = 0,
  children,
}: HeroSectionProps) => {
  const percent = Math.round(clamp(progressFraction) * 100);
  const firstName = name?.split(' ')[0] ?? name;
  const trackColor = withAlpha('#111827', 0.08);

  return (
    <View
      className="relative w-full rounded-b-[44px] bg-highlight px-8 pb-6 shadow-card"
      style={{ paddingTop: topInset + 32 }}
      accessibilityRole="header"
    >
      <View className="flex-col gap-4">
        <View className="flex-col gap-2">
          <Text className="text-[20px] font-[Poppins_600SemiBold] text-charcoal">{`Good morning, ${firstName}`}</Text>
          <Text className="text-[16px] font-[Poppins_400Regular] leading-[24px] text-graphite">
            {`${percent}% toward your body recomposition goal`}
          </Text>
        </View>

        <View
          className="items-center justify-center self-center"
          accessibilityRole="image"
          accessibilityLabel={`${percent}% to goal`}
        >
          <ProgressRing progress={progressFraction} accentGradient={RING_GRADIENT} trackColor={trackColor}>
            <Text className="text-[32px] font-[Poppins_600SemiBold] text-charcoal">{`${percent}%`}</Text>
            <Text className="text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">
              toward goal
            </Text>
          </ProgressRing>
        </View>

        <View className="flex-row items-center justify-between rounded-[20px] border border-[#E5EDF2] bg-[#F8FAFC] px-4 py-3">
          {[{ label: 'Start', value: startLabel }, { label: 'Now', value: currentLabel }, { label: 'Goal', value: goalLabel }].map(
            (item, index) => (
              <Fragment key={item.label}>
                <View className="items-center">
                  <Text className="text-[13px] font-[Poppins_500Medium] uppercase tracking-[1px] text-muted">
                    {item.label}
                  </Text>
                  <Text className="mt-1 text-[18px] font-[Poppins_600SemiBold] text-charcoal">{item.value}</Text>
                </View>
                {index < 2 ? <View className="h-8 w-px bg-[#E5EDF2]" /> : null}
              </Fragment>
            ),
          )}
        </View>
      </View>

      {children ? <View className="mt-4">{children}</View> : null}
    </View>
  );
};
