import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Screen, Heading, VStack, HStack, Body, TextField, NumberField, Chip, Button } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { kgToLb, lbToKg } from '../../lib/metrics';
import { UnitSystem } from '../../types/db';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const { user, update, loading } = useUser();
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'F' | 'M' | 'Other'>('F');
  const [height, setHeight] = useState('');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [startWeight, setStartWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSex(user.sex);
      setHeight(String(user.heightCm));
      setUnitSystem(user.unitSystem);
      setStartWeight((user.unitSystem === 'imperial' ? kgToLb(user.startWeightKg) : user.startWeightKg).toFixed(1));
      setTargetWeight((user.unitSystem === 'imperial' ? kgToLb(user.targetWeightKg) : user.targetWeightKg).toFixed(1));
    }
  }, [user]);

  const handleUnitChange = (next: UnitSystem) => {
    if (next === unitSystem) return;
    const start = parseFloat(startWeight) || 0;
    const target = parseFloat(targetWeight) || 0;
    if (next === 'imperial') {
      setStartWeight(kgToLb(start).toFixed(1));
      setTargetWeight(kgToLb(target).toFixed(1));
    } else {
      setStartWeight(lbToKg(start).toFixed(1));
      setTargetWeight(lbToKg(target).toFixed(1));
    }
    setUnitSystem(next);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await update({
        id: user.id,
        name,
        sex,
        heightCm: parseFloat(height) || user.heightCm,
        unitSystem,
        startWeightKg:
          unitSystem === 'imperial' ? lbToKg(parseFloat(startWeight) || 0) : parseFloat(startWeight) || 0,
        targetWeightKg:
          unitSystem === 'imperial' ? lbToKg(parseFloat(targetWeight) || 0) : parseFloat(targetWeight) || 0,
      });
      Alert.alert('Profile updated');
    } catch {
      Alert.alert('Update failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#37D0B4" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <VStack spacing="xl" className="flex-1">
        <Heading>Settings</Heading>
        <Body className="text-graphite">Fine tune your plan and preferences.</Body>

        <TextField label="Name" value={name} onChangeText={setName} />

        <VStack spacing="sm">
          <Body className="font-[Poppins_600SemiBold] text-muted">Sex</Body>
          <HStack spacing="sm">
            {(['F', 'M', 'Other'] as const).map((option) => (
              <Chip key={option} label={option} selected={sex === option} onPress={() => setSex(option)} />
            ))}
          </HStack>
        </VStack>

        <NumberField label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="number-pad" />

        <VStack spacing="sm">
          <Body className="font-[Poppins_600SemiBold] text-muted">Units</Body>
          <HStack spacing="sm">
            {(['imperial', 'metric'] as const).map((option) => (
              <Chip
                key={option}
                label={option === 'imperial' ? 'Imperial' : 'Metric'}
                selected={unitSystem === option}
                onPress={() => handleUnitChange(option)}
              />
            ))}
          </HStack>
        </VStack>

        <NumberField
          label={`Start weight (${unitSystem === 'imperial' ? 'lb' : 'kg'})`}
          value={startWeight}
          onChangeText={setStartWeight}
        />
        <NumberField
          label={`Target weight (${unitSystem === 'imperial' ? 'lb' : 'kg'})`}
          value={targetWeight}
          onChangeText={setTargetWeight}
        />

        <VStack spacing="sm">
          <Body className="font-[Poppins_600SemiBold] text-muted">Appearance</Body>
          <HStack spacing="sm">
            {(['light', 'dark'] as const).map((scheme) => (
              <Chip
                key={scheme}
                label={scheme.toUpperCase()}
                selected={colorScheme === scheme}
                onPress={() => setColorScheme(scheme)}
              />
            ))}
          </HStack>
        </VStack>

        <Button label={saving ? 'Saving...' : 'Save preferences'} onPress={handleSave} loading={saving} />
      </VStack>
    </Screen>
  );
}
