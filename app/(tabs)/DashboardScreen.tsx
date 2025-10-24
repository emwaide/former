import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeroHeader } from '../../components/dashboard/HeroHeader';
import { MomentumCard } from '../../components/dashboard/MomentumCard';
import { CompositionCard } from '../../components/dashboard/CompositionCard';
import { ConsistencyCard } from '../../components/dashboard/ConsistencyCard';
import { WeeklyTrendCard } from '../../components/dashboard/WeeklyTrendCard';
import { beachPalette, spacing } from '../../components/dashboard/palette';
import { Icon, IconName } from '../../components/Icon';

type WeightSummary = {
  label: string;
  value: string;
};

type HeroData = {
  name: string;
  goalPercent: number;
  weeklySummary: string;
  weightSummary: WeightSummary[];
  accessibilityLabel: string;
};

type MomentumData = {
  changeValue: string;
  caption: string;
  sparklinePoints: number[];
  accessibilityLabel: string;
};

type CompositionHeadlinePart = {
  text: string;
  color?: string;
};

type CompositionData = {
  key: string;
  title: string;
  iconName: IconName;
  headline: CompositionHeadlinePart[];
  progress?: { value: number; color?: string };
  stats: WeightSummary[];
  accessibilityLabel: string;
};

type ConsistencyDay = {
  label: string;
  filled: boolean;
};

type ConsistencyData = {
  loggedSummary: string;
  streakSummary: string;
  days: ConsistencyDay[];
  accessibilityLabel: string;
};

type WeeklyTrendData = {
  actual: number[];
  predicted: number[];
  deltaLabel: string;
  accessibilityLabel: string;
};

type DashboardScreenProps = {
  hero: HeroData;
  momentum: MomentumData;
  compositions: CompositionData[];
  consistency: ConsistencyData;
  weeklyTrend?: WeeklyTrendData;
  footerCopy: string;
};

type AnimatedSectionProps = {
  index: number;
  children: ReactNode;
};

const AnimatedSection = ({ index, children }: AnimatedSectionProps) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 450,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, [animated, index]);

  const translateY = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  return (
    <Animated.View style={{ opacity: animated, transform: [{ translateY }] }}>{children}</Animated.View>
  );
};

export const DashboardScreen = ({
  hero,
  momentum,
  compositions,
  consistency,
  weeklyTrend,
  footerCopy,
}: DashboardScreenProps) => {
  const insets = useSafeAreaInsets();
  const sectionData = useMemo(() => {
    const base = [
      <HeroHeader
        key="hero"
        name={hero.name}
        goalPercent={hero.goalPercent}
        weeklySummary={hero.weeklySummary}
        weightSummary={hero.weightSummary}
        accessibilityLabel={hero.accessibilityLabel}
      />,
      <MomentumCard
        key="momentum"
        changeLabel="Change"
        changeValue={momentum.changeValue}
        caption={momentum.caption}
        sparklinePoints={momentum.sparklinePoints}
        accessibilityLabel={momentum.accessibilityLabel}
      />,
      <View key="composition" style={styles.compositionGrid}>
        {compositions.map((card) => (
          <View key={card.key} style={styles.compositionItem}>
            <CompositionCard
              title={card.title}
              icon={<Icon name={card.iconName as any} size={16} color={`${beachPalette.deepNavy}99`} />}
              headline={
                <Text style={styles.compositionHeadlineText}>
                  {card.headline.map((part, index) => (
                    <Text
                      key={`${card.key}-${index}`}
                      style={[styles.compositionHeadlineText, part.color ? { color: part.color } : null]}
                    >
                      {part.text}
                    </Text>
                  ))}
                </Text>
              }
              progress={card.progress?.value}
              progressColor={card.progress?.color}
              stats={card.stats}
              accessibilityLabel={card.accessibilityLabel}
            />
          </View>
        ))}
      </View>,
      <ConsistencyCard
        key="consistency"
        loggedSummary={consistency.loggedSummary}
        streakSummary={consistency.streakSummary}
        days={consistency.days}
        accessibilityLabel={consistency.accessibilityLabel}
      />,
    ];

    if (weeklyTrend) {
      base.push(
        <WeeklyTrendCard
          key="trend"
          actual={weeklyTrend.actual}
          predicted={weeklyTrend.predicted}
          deltaLabel={weeklyTrend.deltaLabel}
          accessibilityLabel={weeklyTrend.accessibilityLabel}
        />,
      );
    }

    return base;
  }, [hero, momentum, compositions, consistency, weeklyTrend]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: spacing * 8 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {sectionData.map((section, index) => (
          <AnimatedSection key={`section-${index}`} index={index}>
            {section}
          </AnimatedSection>
        ))}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerCopy}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: beachPalette.sandWhite,
  },
  compositionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing * 2,
    marginHorizontal: spacing * 2,
    marginTop: spacing * 3,
  },
  compositionItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 160,
  },
  compositionHeadlineText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: beachPalette.deepNavy,
  },
  footer: {
    marginTop: spacing * 4,
    marginBottom: spacing * 2,
    alignItems: 'center',
    paddingHorizontal: spacing * 2,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: `${beachPalette.driftwood}B3`,
    textAlign: 'center',
  },
});
