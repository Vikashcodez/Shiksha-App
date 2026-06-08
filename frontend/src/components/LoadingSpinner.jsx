import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingSpinner = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
};

export default LoadingSpinner;