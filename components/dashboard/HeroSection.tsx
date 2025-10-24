import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { palette, spacing, typography } from './constants';

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
};

const ProgressRing = ({ progress, size = 200, strokeWidth = 14, children }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = clamp(progress);
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}> 
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.blueLight}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>{children}</View>
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

  return (
    <LinearGradient
      colors={[palette.blueMid, palette.blueLight, palette.aquaSoft]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: topInset + 60 }]}
    >
      <View>
        <Text accessibilityRole="header" style={styles.heading}>
          {`Hi ${name} — here’s your progress this week.`}
        </Text>
        <Text style={styles.subheading}>{`Currently ${currentLabel} · aiming for ${goalLabel}`}</Text>
      </View>

      <ProgressRing progress={progressFraction}>
        <Text style={styles.percentLabel}>{`${percent}%`}</Text>
        <Text style={styles.percentCaption}>to goal</Text>
      </ProgressRing>

      <View style={styles.statsRow} accessibilityRole="text">
        {[{ label: 'Start', value: startLabel }, { label: 'Now', value: currentLabel }, { label: 'Goal', value: goalLabel }].map(
          (item) => (
            <View key={item.label} style={styles.statItem}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ),
        )}
      </View>

      {children ? <View style={styles.ctaContainer}>{children}</View> : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: spacing.lg,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
  subheading: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: typography.body,
    lineHeight: typography.body * 1.4,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing.xs,
  },
  ringContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentLabel: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.5,
  },
  percentCaption: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.body,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Inter_500Medium',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontFamily: 'Inter_600SemiBold',
  },
  ctaContainer: {
    marginTop: spacing.sm,
  },
});

export default HeroSection;
