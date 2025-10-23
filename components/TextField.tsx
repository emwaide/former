import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../theme';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(({ label, error, style, ...rest }, ref) => {
  const { tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      {label ? (
        <Text
          style={{
            fontSize: tokens.typography.label,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.fontFamilyAlt,
            marginBottom: tokens.spacing.xs,
          }}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={tokens.colors.textSecondary}
        style={[
          styles.input,
          {
            borderColor: focused ? tokens.colors.accent : tokens.colors.mutedBorder,
            color: tokens.colors.text,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.input,
            fontFamily: tokens.typography.fontFamily,
          },
          style,
        ]}
        onFocus={(event) => {
          setFocused(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          rest.onBlur?.(event);
        }}
        {...rest}
      />
      {error ? (
        <Text style={{ color: tokens.colors.danger, marginTop: 4, fontSize: 12 }}>{error}</Text>
      ) : null}
    </View>
  );
});

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
