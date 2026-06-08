import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const CustomButton = ({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600';
      case 'secondary':
        return 'bg-gray-600';
      case 'danger':
        return 'bg-red-600';
      case 'outline':
        return 'border-2 border-blue-600 bg-transparent';
      default:
        return 'bg-blue-600';
    }
  };

  const getTextStyles = () => {
    return variant === 'outline' ? 'text-blue-600' : 'text-white';
  };

  return (
    <TouchableOpacity
      className={`${getButtonStyles()} rounded-lg py-3 px-4 ${
        disabled ? 'opacity-50' : 'opacity-100'
      }`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563EB' : '#FFFFFF'} />
      ) : (
        <Text className={`${getTextStyles()} text-center font-semibold text-base`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;