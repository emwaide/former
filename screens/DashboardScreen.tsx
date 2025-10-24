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
  progressValue: number;
  userName: string;
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

const guidanceCopy = 'Small steps matter!';

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
  trackOpacity?: number;
  progressColor: string;
  children?: ReactNode;
};

const ProgressRing = ({
  progress,
  size = 175,
  strokeWidth = 10,
  trackColor,
  trackOpacity = 0.16,
  progressColor,
  children,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          opacity={trackOpacity}
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
  progressValue,
  userName,
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
  const muscleStatus = muscleDescriptor(muscleScore);
  const muscleScoreLabel = `${Math.round(muscleScore)}/100`;
  const muscleLabel = `${muscleStatus} (${muscleScoreLabel})`;
  const progressBadge = `${progressPercent}% to goal`;
  const heroSubline = `Currently ${currentWeight} — aiming for ${goalWeight}`;
  const timelineProgress = Math.min(100, Math.max(0, progressPercent));
  const timelineSteps = [
    { label: 'Start', value: startWeight },
    { label: 'Now', value: currentWeight },
    { label: 'Goal', value: goalWeight },
  ];
  const hasFatStart = typeof fatStartPct === 'number';
  const hasFatCurrent = typeof fatCurrentPct === 'number';
  const safeFatStart = Math.max(0, Math.min(100, hasFatStart ? fatStartPct! : fatStart));
  const safeFatCurrent = Math.max(0, Math.min(100, hasFatCurrent ? fatCurrentPct! : fatCurrent));
  const muscleNormalized = Math.min(1, Math.max(0, muscleScore / 100));

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(32, insets.bottom + 0),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#F2F7FF', '#DCEAFF', '#B8D8FF']}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 10 }]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255, 255, 255, 0.78)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.heroHighlight}
          />
          <View style={styles.heroHeader}>
          </View>
          <View style={styles.heroCopy}>
            <Text
              style={{
                color: tokens.colors.text,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: 30,
                lineHeight: 26,
                letterSpacing: 2,
              }}
            >
              {`Welcome Back, ${userName}!`}
            </Text>
          </View>
          <ProgressRing
            progress={progressValue}
            trackColor="rgba(34, 87, 122, 0.18)"
            trackOpacity={1}
            progressColor={tokens.colors.accentSecondary}
          >
            <Text
              style={{
                color: tokens.colors.accentSecondary,
                fontFamily: tokens.typography.fontFamilyAlt,
                fontSize: 52,
                lineHeight: 56,
                letterSpacing: -0.5,
              }}
            >
              {progressPercent}%
            </Text>
            <Text
              style={{
                color: tokens.colors.accentSecondary,
                fontFamily: tokens.typography.fontFamilyMedium,
                fontSize: tokens.typography.body,
                letterSpacing: 1,
              }}
            >
              to goal
            </Text>
          </ProgressRing>
          <View style={styles.heroStatsRow}>
            {[
              { label: 'Start', value: startWeight },
              { label: 'Now', value: currentWeight },
              { label: 'Goal', value: goalWeight },
            ].map((item) => (
              <View key={item.label} style={styles.heroStat}>
                <Text
                  style={{
                    color: 'rgba(23, 51, 74, 0.55)',
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    color: tokens.colors.accentSecondary,
                    fontFamily: tokens.typography.fontFamilyAlt,
                    fontSize: tokens.typography.body,
                    letterSpacing: 0.4,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
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
              This Week's Overview
            </Text>
          </View>
          <Card
              accessibilityLabel={`Muscle balance: ${muscleLabel}.`}
              style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}
            >
              {/* <LinearGradient
                pointerEvents="none"
                colors={['rgba(8, 107, 167, 0.18)', 'rgba(8, 107, 167, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.compositionGradient}
              /> */}
              <View style={styles.compositionHeader}>
                <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}> 
                  <Icon name="activity" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={muscleLabel} />
                </View>
                <Text
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Muscle Tone
                </Text>
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyAlt,
                  fontSize: tokens.typography.body,
                }}
              >
                {muscleStatus}
              </Text>
              <View style={styles.compositionMeter}>
                <View style={[styles.compositionMeterTrack, { backgroundColor: 'rgba(34, 87, 122, 0.16)' }]}> 
                  <View
                    style={[
                      styles.compositionMeterFill,
                      {
                        width: `${Math.round(muscleNormalized * 100)}%`,
                        backgroundColor: tokens.colors.accentSecondary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.compositionMeterMeta}>
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.caption,
                    }}
                  >
                    Score {muscleScoreLabel}
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
                </View>
              </View>
            </Card>

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
                Weight
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

          <View style={styles.compositionRow}>
            <Card
              accessibilityLabel={`Body composition update: ${fatLabel}.`}
              style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}
            >
              {/* <LinearGradient
                pointerEvents="none"
                colors={['rgba(34, 87, 122, 0.16)', 'rgba(34, 87, 122, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.compositionGradient}
              /> */}
              <View style={styles.compositionHeader}>
                <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}> 
                  <Icon name="trending-down" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={fatLabel} />
                </View>
                <Text
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Body Fat
                </Text>
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyAlt,
                  fontSize: tokens.typography.body,
                }}
              >
                {fatLabel}
              </Text>
              <View style={styles.compositionMeter}>
                <View style={[styles.compositionMeterTrack, { backgroundColor: 'rgba(34, 87, 122, 0.16)' }]}> 
                  <View
                    style={[
                      styles.compositionMeterFill,
                      {
                        width: `${Math.min(100, Math.max(0, safeFatCurrent))}%`,
                        backgroundColor: tokens.colors.accentSecondary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.compositionMeterMeta}>
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.caption,
                    }}
                  >
                    Current {safeFatCurrent.toFixed(1)}%
                  </Text>
                  {hasFatStart && (
                    <Text
                      style={{
                        color: tokens.colors.textSecondary,
                        fontFamily: tokens.typography.fontFamily,
                        fontSize: tokens.typography.caption,
                      }}
                    >
                      Start {safeFatStart.toFixed(1)}%
                    </Text>
                  )}
                </View>
              </View>
            </Card>
            <Card
              accessibilityLabel={`Muscle balance: ${muscleLabel}.`}
              style={[styles.compositionCard, { backgroundColor: tokens.colors.card }]}
            >
              {/* <LinearGradient
                pointerEvents="none"
                colors={['rgba(8, 107, 167, 0.18)', 'rgba(8, 107, 167, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.compositionGradient}
              /> */}
              <View style={styles.compositionHeader}>
                <View style={[styles.compositionIcon, { backgroundColor: 'rgba(34, 87, 122, 0.12)' }]}> 
                  <Icon name="activity" size={20} color={tokens.colors.accentSecondary} accessibilityLabel={muscleLabel} />
                </View>
                <Text
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.fontFamilyMedium,
                    fontSize: tokens.typography.caption,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Muscle Tone
                </Text>
              </View>
              <Text
                style={{
                  color: tokens.colors.text,
                  fontFamily: tokens.typography.fontFamilyAlt,
                  fontSize: tokens.typography.body,
                }}
              >
                {muscleStatus}
              </Text>
              <View style={styles.compositionMeter}>
                <View style={[styles.compositionMeterTrack, { backgroundColor: 'rgba(34, 87, 122, 0.16)' }]}> 
                  <View
                    style={[
                      styles.compositionMeterFill,
                      {
                        width: `${Math.round(muscleNormalized * 100)}%`,
                        backgroundColor: tokens.colors.accentSecondary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.compositionMeterMeta}>
                  <Text
                    style={{
                      color: tokens.colors.text,
                      fontFamily: tokens.typography.fontFamilyMedium,
                      fontSize: tokens.typography.caption,
                    }}
                  >
                    Score {muscleScoreLabel}
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
                </View>
              </View>
            </Card>
          </View>
          <Button label="Log New Entry" onPress={onLogPress} accessibilityLabel="Log a new entry" variant='primary' />
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
    paddingBottom: 30,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    gap: 24,
    overflow: 'hidden',
  },
  heroHighlight: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  heroCopy: {
    gap: 8,
  },
  heroStatsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStat: {
    gap: 4,
    alignItems: 'center',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodySection: {
    paddingHorizontal: 24,
    paddingTop: 10,
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
    gap: 20,
    overflow: 'hidden',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTrackWrapper: {
    height: 12,
    borderRadius: 999,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 32,
  },
  timelineTrackBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  timelineTrackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
  },
  timelineMarkersRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  timelineMarker: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#9FBEE0',
    shadowColor: 'rgba(23, 51, 74, 0.2)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  timelineDotStart: {
    backgroundColor: '#C8DAEB',
  },
  timelineDotCurrent: {
    backgroundColor: '#3F7CAC',
  },
  timelineDotGoal: {
    backgroundColor: '#0C5AA6',
  },
  timelineValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timelineValue: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  compositionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  compositionCard: {
    flex: 1,
    gap: 16,
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  compositionGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  compositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compositionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compositionMeter: {
    gap: 8,
  },
  compositionMeterTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  compositionMeterFill: {
    height: '100%',
    borderRadius: 999,
  },
  compositionMeterMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
