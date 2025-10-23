import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Screen, Heading, VStack, HStack, Chip, TextField, NumberField, Button, Body, Toast } from '../../components';
import { useTheme } from '../../theme';
import { useUser } from '../../hooks/useUser';
import { useReadings } from '../../hooks/useReadings';
import { lbToKg } from '../../lib/metrics';

const unitOptions: Array<'imperial' | 'metric'> = ['imperial', 'metric'];

export default function LogScreen() {
  const { tokens } = useTheme();
  const { user } = useUser();
  const { add } = useReadings(user?.id);
  const [unit, setUnit] = useState<'imperial' | 'metric'>(user?.unitSystem ?? 'imperial');
  const [takenAt, setTakenAt] = useState(new Date().toISOString());
  const [form, setForm] = useState({
    weight: '',
    bodyFat: '',
    muscle: '',
    water: '',
    visceral: '',
    subcut: '',
    muscleMass: '',
    boneMass: '',
    protein: '',
    bmr: '',
    metabolicAge: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ weight?: string }>({});
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    const weightVal = parseFloat(form.weight);
    if (Number.isNaN(weightVal)) {
      setErrors({ weight: 'Enter a valid weight' });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await add({
        takenAt,
        weightKg: unit === 'imperial' ? lbToKg(weightVal) : weightVal,
        bodyFatPct: parseFloat(form.bodyFat) || 0,
        skeletalMusclePct: parseFloat(form.muscle) || 0,
        bodyWaterPct: parseFloat(form.water) || 0,
        visceralFatIdx: parseFloat(form.visceral) || 0,
        subcutFatPct: parseFloat(form.subcut) || 0,
        muscleMassKg: unit === 'imperial' ? lbToKg(parseFloat(form.muscleMass) || 0) : parseFloat(form.muscleMass) || 0,
        boneMassKg: unit === 'imperial' ? lbToKg(parseFloat(form.boneMass) || 0) : parseFloat(form.boneMass) || 0,
        proteinPct: parseFloat(form.protein) || 0,
        bmrKcal: parseInt(form.bmr || '0', 10) || 0,
        metabolicAge: parseInt(form.metabolicAge || '0', 10) || 0,
        notes: form.notes,
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
      setForm({
        weight: '',
        bodyFat: '',
        muscle: '',
        water: '',
        visceral: '',
        subcut: '',
        muscleMass: '',
        boneMass: '',
        protein: '',
        bmr: '',
        metabolicAge: '',
        notes: '',
      });
    } catch (error) {
      Alert.alert('Save failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scrollable={false}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: tokens.spacing.xl, paddingBottom: tokens.spacing['2xl'] }} showsVerticalScrollIndicator={false}>
          <VStack spacing="xl">
            <Heading>Add reading</Heading>
            <Body>Capture the details from today’s body composition scan.</Body>

            <TextField label="Taken at" value={takenAt} onChangeText={setTakenAt} autoCapitalize="none" />

            <VStack spacing="md">
              <Body weight="semibold" color={tokens.colors.textSecondary}>
                Units
              </Body>
              <HStack spacing="sm">
                {unitOptions.map((option) => (
                  <Chip key={option} label={option === 'imperial' ? 'lb' : 'kg'} selected={unit === option} onPress={() => setUnit(option)} />
                ))}
              </HStack>
            </VStack>

            <NumberField label={`Weight (${unit === 'imperial' ? 'lb' : 'kg'})`} value={form.weight} onChangeText={(value) => updateField('weight', value)} error={errors.weight} />
            <NumberField label="Body fat %" value={form.bodyFat} onChangeText={(value) => updateField('bodyFat', value)} />
            <NumberField label="Skeletal muscle %" value={form.muscle} onChangeText={(value) => updateField('muscle', value)} />
            <NumberField label="Body water %" value={form.water} onChangeText={(value) => updateField('water', value)} />
            <NumberField label="Visceral fat index" value={form.visceral} onChangeText={(value) => updateField('visceral', value)} />
            <NumberField label="Subcutaneous fat %" value={form.subcut} onChangeText={(value) => updateField('subcut', value)} />
            <NumberField label={`Muscle mass (${unit === 'imperial' ? 'lb' : 'kg'})`} value={form.muscleMass} onChangeText={(value) => updateField('muscleMass', value)} />
            <NumberField label={`Bone mass (${unit === 'imperial' ? 'lb' : 'kg'})`} value={form.boneMass} onChangeText={(value) => updateField('boneMass', value)} />
            <NumberField label="Protein %" value={form.protein} onChangeText={(value) => updateField('protein', value)} />
            <NumberField label="BMR (kcal)" value={form.bmr} onChangeText={(value) => updateField('bmr', value)} keyboardType="number-pad" />
            <NumberField label="Metabolic age" value={form.metabolicAge} onChangeText={(value) => updateField('metabolicAge', value)} keyboardType="number-pad" />
            <TextField label="Notes" value={form.notes} onChangeText={(value) => updateField('notes', value)} multiline numberOfLines={3} />

            <Button label={saving ? 'Saving...' : 'Save reading'} onPress={handleSubmit} loading={saving} />
          </VStack>
        </ScrollView>
        <Toast visible={savedToast} message="Reading saved" />
      </KeyboardAvoidingView>
    </Screen>
  );
}
