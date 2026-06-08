import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    setTimeout(() => {
      if (!loading) {
        if (isAuthenticated) {
          if (isAdmin) {
            navigation.replace('AdminTabs');
          } else {
            navigation.replace('StudentTabs');
          }
        } else {
          navigation.replace('Login');
        }
      }
    }, 2000);
  }, [loading, isAuthenticated, isAdmin, navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-blue-600">
      <View className="items-center">
        <Text className="text-white text-4xl font-bold mb-2">
          Coaching Centre
        </Text>
        <Text className="text-white text-lg">Your Learning Partner</Text>
        <View className="mt-8">
          <Text className="text-white text-sm">Loading...</Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;