import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native';
import api from '../services/api';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="My Profile" showBack navigation={navigation} />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-6">
          {/* Profile Header */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-blue-600 rounded-full justify-center items-center">
              <Text className="text-white text-4xl font-bold">
                {profile?.full_name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mt-3">
              {profile?.full_name}
            </Text>
            <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
              <Text className="text-green-700 text-sm">Student</Text>
            </View>
          </View>

          {/* Profile Details */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Full Name</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="person" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {profile?.full_name}
                </Text>
              </View>
            </View>

            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Email ID</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="email" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {profile?.email_id}
                </Text>
              </View>
            </View>

            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Mobile Number</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="phone" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {profile?.mobile_no}
                </Text>
              </View>
            </View>

            <View className="border-b border-gray-200 pb-3 mb-3">
              <Text className="text-gray-500 text-sm">Class</Text>
              <View className="flex-row items-center mt-1">
                <Icon name="class" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2">
                  {profile?.class}
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm">School Address</Text>
              <View className="flex-row items-start mt-1">
                <Icon name="location-on" size={20} color="#6B7280" />
                <Text className="text-gray-800 text-base ml-2 flex-1">
                  {profile?.school_address}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-500 text-sm">Member Since</Text>
                <Text className="text-gray-800 font-semibold mt-1">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Icon name="verified" size={30} color="#2563EB" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentProfileScreen;