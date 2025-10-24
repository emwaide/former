import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { beachPalette, shadow, spacing } from './palette';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type WeightSummary = {
  label: string;
  value: string;
};

type HeroHeaderProps = {
  goalPercent: number;
  weeklySummary: string;
  weightSummary: WeightSummary[];
  accessibilityLabel?: string;
};

export const HeroHeader = ({
  goalPercent,
  weeklySummary,
  weightSummary,
  accessibilityLabel,
}: HeroHeaderProps) => {
  const progress = Math.max(0, Math.min(goalPercent / 100, 1));
  const animated = useRef(new Animated.Value(0)).current;
  const gaugeId = useMemo(() => `goalGauge-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [animated, progress]);

  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View accessibilityLabel={accessibilityLabel} style={[styles.wrapper, styles.shadow]}>
      <LinearGradient
        colors={[beachPalette.skyBlue, beachPalette.seafoam]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.heading}>Your week at a glance</Text>
            <Text style={styles.subheading}>Here’s how you’re progressing.</Text>
            <View style={styles.pill} accessible accessibilityLabel={`${goalPercent}% to goal`}>
              <Text style={styles.pillText}>{`${goalPercent}% to goal`}</Text>
            </View>
          </View>
          <View style={styles.gaugeContainer}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <Defs>
                <SvgLinearGradient id={gaugeId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={beachPalette.deepNavy} />
                  <Stop offset="60%" stopColor={beachPalette.skyBlue} />
                  <Stop offset="100%" stopColor={beachPalette.seafoam} />
                </SvgLinearGradient>
              </Defs>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={beachPalette.deepNavy}
                strokeWidth={strokeWidth}
                opacity={0.1}
                fill="none"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={`url(#${gaugeId})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View pointerEvents="none" style={styles.gaugeCenter}>
              <Text style={styles.gaugePercent}>{`${goalPercent}%`}</Text>
              <Text style={styles.gaugeCaption}>to goal</Text>
            </View>
          </View>
        </View>
        <View style={styles.summaryBlock}>
          <Text style={styles.weightSummary}>
            {weightSummary
              .map((item) => `${item.label} ${item.value}`)
              .join('  ·  ')}
          </Text>
          <Text style={styles.weeklySummary}>{weeklySummary}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing * 2,
    marginTop: spacing * 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
    elevation: shadow.elevation,
  },
  gradient: {
    borderRadius: 16,
    padding: spacing * 2,
    gap: spacing * 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: spacing * 2,
  },
  headerCopy: {
    flex: 1,
  },
  heading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: beachPalette.deepNavy,
  },
  subheading: {
    marginTop: spacing * 0.75,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: `${beachPalette.driftwood}B3`,
  },
  pill: {
    marginTop: spacing * 1.5,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(30,58,95,0.07)',
  },
  pillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: beachPalette.deepNavy,
    letterSpacing: 0.5,
  },
  gaugeContainer: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    alignSelf: 'center',
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugePercent: {
    fontFamily: 'Inter_500Medium',
    fontSize: 22,
    color: beachPalette.deepNavy,
  },
  gaugeCaption: {
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: `${beachPalette.driftwood}CC`,
  },
  summaryBlock: {
    gap: spacing * 1.5,
  },
  weightSummary: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: `${beachPalette.driftwood}CC`,
  },
  weeklySummary: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: beachPalette.deepNavy,
  },
});
