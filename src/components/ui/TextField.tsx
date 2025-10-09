import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { COLORS } from '../../constants/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, error, ...rest }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="rgba(148, 163, 184, 0.55)"
        style={styles.input}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  error: {
    color: COLORS.accentPink,
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
