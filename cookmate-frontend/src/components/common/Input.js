import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  helperText,
  multiline = false,
  numberOfLines = 1,
  style,
  ...props 
}) => {
  return (
    <View style={[{ marginVertical: 8 }, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        multiline={multiline}
        numberOfLines={numberOfLines}
        mode="outlined"
        {...props}
      />
      {(error || helperText) && (
        <HelperText type={error ? "error" : "info"}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
};

export default Input;