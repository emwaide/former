import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Button, Card, Icon } from '../components';
import { useTheme } from '../theme';
import { formatWeight, formatWeeklyChange } from '../utils/format';
import { UnitSystem } from '../types/db';

type DashboardScreenProps = {
  headerSubtitle: string;
  progressValue: number;
  startWeightKg: number;
  currentWeightKg: number;
  goalWeightKg: number;
  weeklyChangeKg: number;
  weeklyChangeLabel: string;
  previousWeightLabel: string;
  previousCheckInDate?: string;
  fatStartPct?: number;
  fatCurrentPct?: number;
  muscleScore: number;
  unitSystem: UnitSystem;
  onLogPress: () => void;
};

const guidanceCopy = 'Keep your rhythm — small steps matter.';

const muscleDescriptor = (score: number) => {
  if (score >= 85) return 'Muscle thriving';
  if (score >= 70) return 'Muscle stable';
  if (score >= 50) return 'Muscle watch';
  return 'Muscle focus';
};

const formatCompositionDelta = (start: number, current: number) => {
  const delta = start - current;
  if (Math.abs(delta) < 0.05) {
    return 'Fat steady';
  }
  const direction = delta > 0 ? '↓' : '↑';
  return `Fat ${direction} ${Math.abs(delta).toFixed(1)}%`;
};

const composeMomentumCaption = (weight: string, date?: string) => {
  if (!date) {
    return `Previously ${weight} on your last check-in.`;
  }
  return `Previously ${weight} on ${date}.`;
};

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor: string;
  progressColor: string;
  children?: ReactNode;
};

const ProgressRing = ({
  progress,
  size = 200,
  strokeWidth = 16,
  trackColor,
  progressColor,
  children,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          opacity={0.16}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.progressCenter}>{children}</View>
    </View>
  );
};

const DashboardScreen = ({
  headerSubtitle,
  progressValue,
  startWeightKg,
  currentWeightKg,
  goalWeightKg,
  weeklyChangeKg,
  weeklyChangeLabel,
  previousWeightLabel,
  previousCheckInDate,
  fatStartPct,
  fatCurrentPct,
  muscleScore,
  unitSystem,
  onLogPress,
}: DashboardScreenProps) => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const startWeight = formatWeight(startWeightKg, unitSystem);
  const currentWeight = formatWeight(currentWeightKg, unitSystem);
  const goalWeight = formatWeight(goalWeightKg, unitSystem);
  const progressPercent = Math.round(progressValue * 100);
  const weeklyChangeText = weeklyChangeLabel || formatWeeklyChange(weeklyChangeKg, unitSystem);
  const momentumCaption = composeMomentumCaption(previousWeightLabel, previousCheckInDate);
  const fatStart = fatStartPct ?? fatCurrentPct ?? 0;
  const fatCurrent = fatCurrentPct ?? fatStartPct ?? 0;
  const fatLabel = formatCompositionDelta(fatStart, fatCurrent);
  const muscleLabel = `${muscleDescriptor(muscleScore)} (${Math.round(muscleScore)}/100)`;
  const progressBadge = `${progressPercent}% to goal`;

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(32, insets.bottom + 48),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[tokens.colors.accentTertiary, tokens.colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 32 }]}
        >
          <View style={styles.heroHeader}>
            <Text
              style={{
                color: 'rgba(10, 45, 62, 0.72)',
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.caption,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Your Progress
            </Text>
            <View
              accessibilityLabel={`Progress badge: ${progressBadge}`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                borderRadius: tokens.radius.pill,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color: tokens.colors.accentSecondary,
                  fontFamily: tokens.typography.fontFamilyMedium,
                  fontSize: tokens.typography.caption,
                }}
              >
                {progressBadge}
              </Text>
            </View>
          </View>

          <ProgressRing
            progress={progressValue}
            trackColor={tokens.colors.accentSecondary}
            progressColor={tokens.colors.accentSecondary}
          >
            <Text
              style={{
                color: tokens.colors.accentSecondary,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: 48,
                lineHeight: 52,
              }}
            >
              {progressPercent}%
            </Text>
            <Text
              style={{
                color: tokens.colors.accentSecondary,
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.body,
              }}
            >
              to goal
            </Text>
          </ProgressRing>

          <Text
            style={{
              color: 'rgba(10, 45, 62, 0.68)',
              fontFamily: tokens.typography.fontFamily,
              fontSize: tokens.typography.body,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {headerSubtitle}
          </Text>
        </LinearGradient>

        <View style={styles.bodySection}>
          <View style={styles.momentumSection}>
            <Text
              style={{
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.caption,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Momentum
            </Text>
            <Text
              style={{
                color: tokens.colors.text,
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.body,
                lineHeight: 22,
              }}
            >
              {guidanceCopy}
            </Text>
          </View>

          <Card
            accessibilityLabel={`This week's change: ${weeklyChangeText}. ${momentumCaption}`}
            style={[styles.weeklyCard, { backgroundColor: tokens.colors.card }]}
          >
            <View style={styles.weeklyHeader}>
              <Text
                style={{
                  color: tokens.colors.textSecondary,
                  fontFamily: tokens.typography.fontFamilyMedium,
                  fontSize: tokens.typography.caption,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                This Week's Change
              </Text>
              <View style={styles.weeklyBadge}>
                <Text
                  style={{
                    color: tokens.colors.accent,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                  }}
                >
                  {weeklyChangeText}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: tokens.colors.text,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: tokens.typography.numeric,
                lineHeight: 36,
              }}
            >
              {weeklyChangeText}
            </Text>
            <Text
              style={{
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontFamily,
                fontSize: tokens.typography.body,
                lineHeight: 20,
              }}
            >
              {momentumCaption}
            </Text>
          </Card>

          <View
            accessibilityLabel={`Weight timeline. Start ${startWeight}. Current ${currentWeight}. Goal ${goalWeight}. ${headerSubtitle}`}
            style={[styles.timelineCard, { backgroundColor: tokens.colors.contrastCard }]}
          >
            {[{ label: 'Start', value: startWeight }, { label: 'Current', value: currentWeight }, { label: 'Goal', value: goalWeight }].map(
              (row) => (
                <View key={row.label} style={styles.timelineRow}>
                  <Text
                    style={{
                      color: tokens.colors.textSecondary,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.caption,
                      textTransform: 'uppercase',
                    }}
                  >
                    {row.label}
                  </Text>
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.body,
                    }}
                  >
                    {row.value}
                  </Text>
                </View>
              ),
            )}
          </View>

          <View style={styles.compositionRow}>
            <Card accessibilityLabel={`Body composition update: ${fatLabel}.`} style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}>
              <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}>
                <Icon name="trending-down" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={fatLabel} />
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyMedium,
                  fontSize: tokens.typography.body,
                }}
              >
                {fatLabel}
              </Text>
              <Text
                style={{
                  color: tokens.colors.textSecondary,
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: tokens.typography.caption,
                }}
              >
                vs start
              </Text>
            </Card>
            <Card accessibilityLabel={`Muscle balance: ${muscleLabel}.`} style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}>
              <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}>
                <Icon name="activity" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={muscleLabel} />
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyMedium,
                  fontSize: tokens.typography.body,
                }}
              >
                {muscleLabel}
              </Text>
              <Text
                style={{
                  color: tokens.colors.textSecondary,
                  fontFamily: tokens.typography.fontFamily,
                  fontSize: tokens.typography.caption,
                }}
              >
                Strength trend
              </Text>
            </Card>
          </View>

          <Button label="+ Log New Entry" onPress={onLogPress} accessibilityLabel="Log a new entry" />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 24,
  },
  hero: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    gap: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodySection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 24,
  },
  momentumSection: {
    gap: 8,
  },
  weeklyCard: {
    gap: 16,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(34, 87, 122, 0.12)',
  },
  timelineCard: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 16,
    shadowColor: 'rgba(34, 87, 122, 0.12)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    elevation: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compositionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  compositionCard: {
    flex: 1,
    gap: 12,
  },
  compositionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
