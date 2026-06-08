import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminDashboardScreen = ({ navigation }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  const menuItems = [
    {
      title: 'All Students',
      icon: 'people',
      color: '#2563EB',
      screen: 'AllStudents',
      description: 'View and manage all registered students'
    },
    {
      title: 'Student Statistics',
      icon: 'bar-chart',
      color: '#10B981',
      screen: 'StudentStats',
      description: 'View class-wise statistics'
    },
    {
      title: 'Add New Student',
      icon: 'person-add',
      color: '#F59E0B',
      screen: 'AddStudent',
      description: 'Register a new student manually'
    },
    {
      title: 'Reports',
      icon: 'assessment',
      color: '#EF4444',
      screen: 'Reports',
      description: 'Generate student reports'
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Admin Dashboard" onLogout={handleLogout} />
      
      <ScrollView>
        <View className="p-6">
          {/* Welcome Card */}
          <View className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-6">
            <Text className="text-white text-2xl font-bold">
              Welcome, Admin!
            </Text>
            <Text className="text-blue-100 mt-2">
              Manage your coaching centre efficiently
            </Text>
          </View>

          {/* Stats Overview */}
          <View className="flex-row mb-6">
            <View className="flex-1 bg-white rounded-lg p-4 mr-3 shadow-sm">
              <Icon name="school" size={32} color="#2563EB" />
              <Text className="text-gray-800 font-bold text-2xl mt-2">
                150+
              </Text>
              <Text className="text-gray-500 text-sm">Total Students</Text>
            </View>
            <View className="flex-1 bg-white rounded-lg p-4 shadow-sm">
              <Icon name="class" size={32} color="#10B981" />
              <Text className="text-gray-800 font-bold text-2xl mt-2">
                5
              </Text>
              <Text className="text-gray-500 text-sm">Active Classes</Text>
            </View>
          </View>

          {/* Menu Items */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Management Options
          </Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-lg p-4 mb-3 flex-row items-center shadow-sm"
              onPress={() => navigation.navigate(item.screen)}
            >
              <View
                className="w-12 h-12 rounded-lg justify-center items-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-gray-800 font-semibold text-base">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.description}
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;