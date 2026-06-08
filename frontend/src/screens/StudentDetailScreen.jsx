import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import api from '../services/api';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.full_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await api.delete(`/admin/students/${student.id}`);
              Alert.alert('Success', 'Student deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student');
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Student Details" showBack navigation={navigation} />
      
      <ScrollView>
        <View className="p-6">
          {/* Profile Header */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-blue-600 rounded-full justify-center items-center">
              <Text className="text-white text-4xl font-bold">
                {student.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mt-3">
              {student.full_name}
            </Text>
            <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
              <Text className="text-green-700 text-sm">Student</Text>
            </View>
          </View>

          {/* Student Details */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Email ID</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="email" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {student.email_id}
                </Text>
              </View>
            </View>

            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Mobile Number</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="phone" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {student.mobile_no}
                </Text>
              </View>
            </View>

            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Class</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="class" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {student.class}
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm">School Address</Text>
              <View className="flex-row items-start mt-1">
                <Icon name="location-on" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2 flex-1">
                  {student.school_address}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-500 text-sm">Registered On</Text>
                <Text className="text-gray-800 font-semibold mt-1">
                  {new Date(student.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Icon name="verified" size={30} color="#2563EB" />
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            className="bg-red-600 rounded-lg p-3 mt-6 flex-row justify-center items-center"
            onPress={handleDelete}
            disabled={deleting}
          >
            <Icon name="delete" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base ml-2">
              {deleting ? 'Deleting...' : 'Delete Student'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentDetailScreen;