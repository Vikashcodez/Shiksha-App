import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentDashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Student Dashboard" onLogout={handleLogout} />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-6">
          {/* Welcome Card */}
          <View className="bg-blue-600 rounded-xl p-6 mb-6">
            <Text className="text-white text-2xl font-bold">
              Welcome, {profile?.full_name?.split(' ')[0]}!
            </Text>
            <Text className="text-blue-100 mt-2">
              {profile?.class} Standard Student
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row mb-6">
            <View className="flex-1 bg-white rounded-lg p-4 mr-3 shadow-sm">
              <Icon name="school" size={32} color="#2563EB" />
              <Text className="text-gray-800 font-bold text-lg mt-2">
                {profile?.class}
              </Text>
              <Text className="text-gray-500 text-sm">Current Class</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
              <Icon name="event" size={32} color="#2563EB" />
              <Text className="text-gray-800 font-bold text-lg mt-2">
                Active
              </Text>
              <Text className="text-gray-500 text-sm">Status</Text>
            </View>
          </View>

          {/* Menu Items */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          
          <TouchableOpacity
            className="bg-white rounded-lg p-4 mb-3 flex-row items-center shadow-sm"
            onPress={() => navigation.navigate('StudentProfile')}
          >
            <Icon name="person" size={24} color="#2563EB" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-800 font-semibold text-base">
                My Profile
              </Text>
              <Text className="text-gray-500 text-sm">
                View and update your profile
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-lg p-4 mb-3 flex-row items-center shadow-sm"
            onPress={() => navigation.navigate('UpdateProfile')}
          >
            <Icon name="edit" size={24} color="#2563EB" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-800 font-semibold text-base">
                Update Profile
              </Text>
              <Text className="text-gray-500 text-sm">
                Update your personal information
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-lg p-4 flex-row items-center shadow-sm"
            onPress={() => {}}
          >
            <Icon name="assignment" size={24} color="#2563EB" />
            <View className="flex-1 ml-3">
              <Text className="text-gray-800 font-semibold text-base">
                My Courses
              </Text>
              <Text className="text-gray-500 text-sm">
                View your enrolled courses
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentDashboardScreen;