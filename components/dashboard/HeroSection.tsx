import { Fragment, ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
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
  size = 210,
  strokeWidth = 18,
  children,
  accentGradient,
}: ProgressRingProps & { accentGradient: [string, string] }) => {
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
          stroke="rgba(255,255,255,0.22)"
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
  const initial = firstName?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <LinearGradient
      colors={tokens.colors.heroGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: topInset + tokens.spacing.lg }]}
    >
      <View style={styles.navRow}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Feather
              name="wind"
              size={18}
              color="#FFFFFF"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <Text style={styles.brandText}>Former</Text>
        </View>

        <View style={styles.navActions}>
          <View style={styles.actionBadge}>
            <Feather
              name="bell"
              size={18}
              color="rgba(255,255,255,0.92)"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <View style={styles.actionBadge}>
            <Feather
              name="pie-chart"
              size={18}
              color="rgba(255,255,255,0.92)"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          </View>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
      </View>

      <View style={styles.topRow}>
        <View style={styles.copyBlock}>
          <Text accessibilityRole="header" style={styles.heading}>
            {`Good morning, ${firstName}`}
          </Text>
          <Text style={styles.subheading}>{`${percent}% toward your body recomposition goal`}</Text>
        </View>

        <View style={styles.ringWrapper} accessibilityRole="image" accessibilityLabel={`${percent}% to goal`}>
          <ProgressRing progress={progressFraction} accentGradient={tokens.colors.ringGradient}>
            <Text style={styles.percentLabel}>{`${percent}%`}</Text>
            <Text style={styles.percentCaption}>to goal</Text>
          </ProgressRing>
        </View>
      </View>

      <View style={styles.statsRow} accessibilityRole="text">
        {[{ label: 'Start', value: startLabel }, { label: 'Now', value: currentLabel }, { label: 'Goal', value: goalLabel }].map((item, index) => (
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
      marginHorizontal: -tokens.spacing.md,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    brandBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    brandText: {
      color: '#FFFFFF',
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: 0.4,
    },
    navActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    actionBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.14)',
    },
    avatarBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.92)',
    },
    avatarText: {
      color: tokens.colors.brandNavy,
      fontSize: tokens.typography.subheading,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: 0.2,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: tokens.spacing.lg,
    },
    copyBlock: {
      flex: 1,
      gap: tokens.spacing.xs,
    },
    heading: {
      color: '#FFFFFF',
      fontSize: tokens.typography.heading,
      lineHeight: 34,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.2,
    },
    subheading: {
      color: 'rgba(255,255,255,0.88)',
      fontSize: tokens.typography.body,
      lineHeight: tokens.typography.body * 1.4,
      fontFamily: tokens.typography.fontFamily,
      letterSpacing: -0.2,
    },
    ringWrapper: {
      padding: 0,
      borderRadius: 999,
      backgroundColor: 'transparent',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    percentLabel: {
      color: '#FFFFFF',
      fontSize: 52,
      lineHeight: 58,
      fontFamily: tokens.typography.fontFamilyAlt,
      letterSpacing: -0.6,
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
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: 20,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    statDivider: {
      width: StyleSheet.hairlineWidth,
      height: '70%',
      backgroundColor: 'rgba(255,255,255,0.35)',
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
