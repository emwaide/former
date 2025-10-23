import { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { TextField, TextFieldProps } from './TextField';

export const NumberField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
  return <TextField ref={ref} keyboardType="decimal-pad" {...props} />;
});

NumberField.displayName = 'NumberField';
