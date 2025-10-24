import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import DashboardScreen from '../../screens/DashboardScreen';
import { EmptyState } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { useAnalytics, Analytics } from '../../hooks/useAnalytics';
import { formatDate, formatWeight, formatWeeklyChange, sortReadingsDesc } from '../../utils/format';
import { Reading, UserProfile } from '../../types/db';

const LoadingState = () => {
  const { tokens } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.colors.background,
      }}
    >
      <ActivityIndicator size="large" color={tokens.colors.accentSecondary} />
    </View>
  );
};

type DashboardContentProps = {
  loading: boolean;
  user: UserProfile | null;
  readings: Reading[];
  analytics: Analytics;
};

export const DashboardContent = ({ loading, user, readings, analytics }: DashboardContentProps) => {
  const router = useRouter();
  const { tokens } = useTheme();
  const sorted = useMemo(() => sortReadingsDesc(readings), [readings]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user || readings.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.colors.background,
          paddingHorizontal: tokens.spacing.xl,
          paddingTop: tokens.spacing['2xl'],
        }}
      >
        <EmptyState
          title="No readings yet"
          description="Log your first reading to unlock progress tracking and insights."
          actionLabel="Add first reading"
          onAction={() => router.push('/(tabs)/log')}
        />
      </View>
    );
  }

  const latest = sorted[0];
  const previous = sorted[1] ?? sorted[0];
  const first = sorted[sorted.length - 1];

  const progressValue = Math.max(0, Math.min(1, analytics.progressPercent ?? 0));
  const weeklyChangeLabel = formatWeeklyChange(analytics.weeklyChangeKg ?? 0, user.unitSystem);
  const previousWeightLabel = formatWeight(previous.weightKg, user.unitSystem);
  const previousCheckInDate = previous ? formatDate(previous.takenAt) : undefined;

  return (
    <DashboardScreen
      progressValue={progressValue}
      userName={user.name}
      startWeightKg={user.startWeightKg}
      currentWeightKg={latest.weightKg}
      goalWeightKg={user.targetWeightKg}
      weeklyChangeKg={analytics.weeklyChangeKg ?? 0}
      weeklyChangeLabel={weeklyChangeLabel}
      previousWeightLabel={previousWeightLabel}
      previousCheckInDate={previousCheckInDate}
      fatStartPct={first?.bodyFatPct ?? latest.bodyFatPct}
      fatCurrentPct={latest.bodyFatPct}
      muscleScore={analytics.muscleScore ?? 0}
      unitSystem={user.unitSystem}
      onLogPress={() => router.push('/(tabs)/log')}
    />
  );
};

export default function DashboardRoute() {
  const { user, loading: loadingUser } = useUser();
  const { readings, loading: loadingReadings } = useReadings(user?.id);
  const analytics = useAnalytics(user, readings);

  return (
    <DashboardContent
      loading={loadingUser || loadingReadings}
      user={user}
      readings={readings}
      analytics={analytics}
    />
  );
}