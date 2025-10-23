import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

type StackProps = PropsWithChildren<{
  spacing?: keyof ReturnType<typeof useTheme>['tokens']['spacing'];
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export const HStack = ({ spacing = 'md', align = 'center', justify = 'flex-start', wrap = false, style, children }: StackProps) => {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        styles.stack,
        {
          flexDirection: 'row',
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          gap: tokens.spacing[spacing],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const VStack = ({ spacing = 'md', align = 'stretch', justify = 'flex-start', style, children }: StackProps) => {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        styles.stack,
        {
          flexDirection: 'column',
          alignItems: align,
          justifyContent: justify,
          gap: tokens.spacing[spacing],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Spacer = () => <View style={{ flex: 1 }} />;

const styles = StyleSheet.create({
  stack: {
    width: '100%',
  },
});
