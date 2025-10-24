import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeroHeader } from '../../components/dashboard/HeroHeader';
import { MomentumCard } from '../../components/dashboard/MomentumCard';
import { CompositionCard } from '../../components/dashboard/CompositionCard';
import { beachPalette, spacing } from '../../components/dashboard/palette';
import { Icon, IconName } from '../../components/Icon';

type WeightSummary = {
  label: string;
  value: string;
};

type HeroData = {
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

type DashboardScreenProps = {
  hero: HeroData;
  momentum: MomentumData;
  compositions: CompositionData[];
  footerCopy: string;
};

type AnimatedSectionProps = {
  index: number;
  children: ReactNode;
};

type SectionItem = {
  key: string;
  node: ReactNode;
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

export const DashboardScreen = ({ hero, momentum, compositions, footerCopy }: DashboardScreenProps) => {
  const insets = useSafeAreaInsets();
  const sectionData: SectionItem[] = useMemo(
    () => [
      {
        key: 'hero',
        node: (
          <HeroHeader
            goalPercent={hero.goalPercent}
            weeklySummary={hero.weeklySummary}
            weightSummary={hero.weightSummary}
            accessibilityLabel={hero.accessibilityLabel}
          />
        ),
      },
      {
        key: 'momentum',
        node: (
          <MomentumCard
            changeLabel="Change"
            changeValue={momentum.changeValue}
            caption={momentum.caption}
            sparklinePoints={momentum.sparklinePoints}
            accessibilityLabel={momentum.accessibilityLabel}
          />
        ),
      },
      ...compositions.map((card) => ({
        key: `composition-${card.key}`,
        node: (
          <View style={styles.sectionSpacing}>
            <CompositionCard
              title={card.title}
              icon={<Icon name={card.iconName as any} size={16} color={`${beachPalette.deepNavy}99`} />}
              headline={card.headline}
              progress={card.progress?.value}
              progressColor={card.progress?.color}
              stats={card.stats}
              accessibilityLabel={card.accessibilityLabel}
            />
          </View>
        ),
      })),
    ],
    [hero, momentum, compositions],
  );

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
          <AnimatedSection key={section.key} index={index}>
            {section.node}
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
  sectionSpacing: {
    marginHorizontal: spacing * 2,
    marginTop: spacing * 3,
  },
  footer: {
    marginTop: spacing * 3,
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
