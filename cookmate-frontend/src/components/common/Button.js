import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

const Button = ({ 
  title, 
  onPress, 
  mode = 'contained', 
  disabled = false, 
  loading = false,
  style,
  ...props 
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled || loading}
      loading={loading}
      style={[{ marginVertical: 8 }, style]}
      {...props}
    >
      {title}
    </PaperButton>
  );
};

export default Button;