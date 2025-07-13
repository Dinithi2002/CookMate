import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { globalStyles } from '../../styles/globalStyles';

const LoadingSpinner = ({ size = 'large' }) => {
  return (
    <View style={globalStyles.centeredContainer}>
      <ActivityIndicator size={size} color="#FF6B35" />
    </View>
  );
};

export default LoadingSpinner;