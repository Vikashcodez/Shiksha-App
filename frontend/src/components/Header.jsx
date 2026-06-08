import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ title, showBack, navigation, onLogout }) => {
  return (
    <View className="bg-blue-600 px-4 py-4 flex-row justify-between items-center">
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text className="text-white text-xl font-bold">{title}</Text>
      </View>
      {onLogout && (
        <TouchableOpacity onPress={onLogout}>
          <Icon name="logout" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;