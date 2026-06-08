import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pt-20 pb-10">
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-blue-600 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 text-center">
              Login to your account to continue
            </Text>
          </View>

          <View className="flex-row mb-6 bg-gray-200 rounded-lg p-1">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg ${
                role === 'student' ? 'bg-blue-600' : ''
              }`}
              onPress={() => setRole('student')}
            >
              <Text
                className={`text-center font-semibold ${
                  role === 'student' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg ${
                role === 'admin' ? 'bg-blue-600' : ''
              }`}
              onPress={() => setRole('admin')}
            >
              <Text
                className={`text-center font-semibold ${
                  role === 'admin' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />

          {role === 'student' && (
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;