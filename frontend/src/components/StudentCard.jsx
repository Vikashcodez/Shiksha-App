import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentCard = ({ student, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 shadow-md border border-gray-200"
      onPress={() => onPress(student)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {student.full_name}
          </Text>
          <View className="flex-row items-center mt-2">
            <Icon name="email" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{student.email_id}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="phone" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">{student.mobile_no}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Icon name="class" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">Class: {student.class}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

export default StudentCard;