import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import StudentStack from './StudentStack';
import AdminStack from './AdminStack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : isAdmin ? (
        <Stack.Screen name="Admin" component={AdminStack} />
      ) : (
        <Stack.Screen name="Student" component={StudentStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;