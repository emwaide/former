import { Fragment, ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { ThemeTokens, useTheme } from '../../theme';

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
};

const ProgressRing = ({
  progress,
  size = 160,
  strokeWidth = 12,
  children,
  accentGradient,
  trackColor,
}: ProgressRingProps & { accentGradient: [string, string]; trackColor: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = clamp(progress);
  const strokeDashoffset = circumference * (1 - clamped);
  const gradientId = useMemo(
    () => `ringGradient-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  return (
    <View style={[ringStyles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={accentGradient[0]} stopOpacity={1} />
            <Stop offset="100%" stopColor={accentGradient[1]} stopOpacity={1} />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
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
  const firstName = name?.split(' ')[0] ?? name;
  const trackColor =
    tokens.mode === 'dark'
      ? withAlpha('#FFFFFF', 0.2)
      : withAlpha(tokens.colors.text, 0.1);

  return (
    <View style={[styles.container, { paddingTop: topInset + tokens.spacing.xl }]}
      accessibilityRole="header"
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.copyBlock}>
        <Text accessibilityRole="header" style={styles.heading}>
          {`Good morning, ${firstName}`}
        </Text>
        <Text style={styles.subheading}>{`${percent}% toward your body recomposition goal`}</Text>
      </View>

      <View
        style={styles.ringWrapper}
        accessibilityRole="image"
        accessibilityLabel={`${percent}% to goal`}
      >
        <ProgressRing
          progress={progressFraction}
          accentGradient={tokens.colors.ringGradient}
          trackColor={trackColor}
        >
          <Text style={styles.percentLabel}>{`${percent}%`}</Text>
          <Text style={styles.percentCaption}>toward goal</Text>
        </ProgressRing>
      </View>

      <View style={styles.statsRow} accessibilityRole="text">
        {[
          { label: 'Start', value: startLabel },
          { label: 'Now', value: currentLabel },
          { label: 'Goal', value: goalLabel },
        ].map((item, index) => (
          <Fragment key={item.label}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
            {index < 2 ? <View style={styles.statDivider} /> : null}
          </Fragment>
        ))}
      </View>

      {children ? <View style={styles.ctaContainer}>{children}</View> : null}
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: tokens.spacing.xl,
      paddingBottom: tokens.spacing.lg,
      borderBottomLeftRadius: 44,
      borderBottomRightRadius: 44,
      gap: tokens.spacing.lg,
      marginHorizontal: 0,
      backgroundColor: tokens.colors.card,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(11, 37, 69, 0.08)',
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 6,
      overflow: 'hidden',
    },
    copyBlock: {
      gap: tokens.spacing.xs,
    },
    heading: {
      color: tokens.colors.text,
      fontSize: tokens.typography.heading,
      lineHeight: 30,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.3,
    },
    subheading: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.5,
      fontFamily: tokens.typography.fontFamily,
    },
    ringWrapper: {
      paddingTop: tokens.spacing.sm,
      alignItems: 'center',
    },
    percentLabel: {
      color: tokens.colors.accent,
      fontSize: tokens.typography.numeric,
      lineHeight: tokens.typography.numeric + 6,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.4,
    },
    percentCaption: {
      color: tokens.colors.textSecondary,
      fontSize: tokens.typography.caption,
      fontFamily: tokens.typography.fontFamilyMedium,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      backgroundColor:
        tokens.mode === 'dark'
          ? withAlpha(tokens.colors.text, 0.08)
          : withAlpha(tokens.colors.text, 0.04),
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    statDivider: {
      width: StyleSheet.hairlineWidth,
      height: '65%',
      backgroundColor: withAlpha(tokens.colors.text, tokens.mode === 'dark' ? 0.3 : 0.15),
    },
    statLabel: {
      color: withAlpha(tokens.colors.text, tokens.mode === 'dark' ? 0.5 : 0.4),
      fontSize: tokens.typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontFamily: tokens.typography.fontFamilyMedium,
    },
    statValue: {
      color: tokens.colors.text,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
    },
    ctaContainer: {
      marginTop: tokens.spacing.sm,
    },
    glowTop: {
      position: 'absolute',
      top: -160,
      right: -120,
      width: 260,
      height: 260,
      backgroundColor: withAlpha(tokens.colors.accent, 0.12),
      borderRadius: 130,
    },
    glowBottom: {
      position: 'absolute',
      bottom: -120,
      left: -80,
      width: 220,
      height: 220,
      backgroundColor: withAlpha(tokens.colors.accentSecondary, 0.12),
      borderRadius: 110,
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
