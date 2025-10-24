import { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { ThemeTokens, useTheme } from '../../theme';

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
};

const ProgressRing = ({
  progress,
  size = 200,
  strokeWidth = 14,
  children,
  accentColor,
}: ProgressRingProps & { accentColor: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = clamp(progress);
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={[ringStyles.container, { width: size, height: size }]}>
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
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={ringStyles.center}>{children}</View>
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
  const { tokens } = useTheme();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const percent = Math.round(clamp(progressFraction) * 100);

  return (
    <LinearGradient
      colors={tokens.colors.heroGradient}
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

      <ProgressRing progress={progressFraction} accentColor={tokens.colors.accentTertiary}>
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

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: tokens.spacing.xl,
      paddingBottom: tokens.spacing.xl,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      gap: tokens.spacing.lg,
    },
    heading: {
      color: '#FFFFFF',
      fontSize: tokens.typography.heading,
      lineHeight: 32,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: 0.2,
    },
    subheading: {
      color: 'rgba(255,255,255,0.88)',
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
      marginTop: tokens.spacing.xs,
    },
    percentLabel: {
      color: '#FFFFFF',
      fontSize: 48,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.5,
    },
    percentCaption: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 20,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
    },
    statItem: {
      alignItems: 'center',
      gap: 4,
    },
    statLabel: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: tokens.typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    statValue: {
      color: '#FFFFFF',
      fontSize: tokens.typography.body,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    ctaContainer: {
      marginTop: tokens.spacing.sm,
    },
  });

const ringStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HeroSection;
