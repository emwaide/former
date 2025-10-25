import { forwardRef, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { getColor } from '../utils/colors';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(({ label, error, className = '', ...rest }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full">
      {label ? (
        <Text className="mb-2 text-[13px] font-[Poppins_600SemiBold] uppercase tracking-[1px] text-muted">
          {label}
        </Text>
      ) : null}

      <TextInput
        ref={ref}
        placeholderTextColor={getColor('placeholder')}
        className={`w-full rounded-[12px] border bg-surface px-4 py-3 text-[16px] font-[Poppins_400Regular] text-charcoal ${
          focused ? 'border-teal' : 'border-border'
        } ${className}`}
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
        <Text className="mt-1 text-[12px] font-[Poppins_400Regular] text-negative">{error}</Text>
      ) : null}
    </View>
  );
});

TextField.displayName = 'TextField';
