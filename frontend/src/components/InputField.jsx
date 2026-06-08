import React from 'react';
import { View, TextInput, Text } from 'react-native';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  multiline,
  numberOfLines
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-semibold mb-2 text-base">
          {label}
        </Text>
      )}
      <TextInput
        className={`border rounded-lg px-4 py-3 text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${multiline ? 'h-24' : 'h-12'}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};

export default InputField;