import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';

const StudentRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_no: '',
    email_id: '',
    class: '',
    school_address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.full_name) return 'Full name is required';
    if (!formData.mobile_no || formData.mobile_no.length !== 10)
      return 'Valid mobile number is required';
    if (!formData.email_id) return 'Email is required';
    if (!formData.class) return 'Class is required';
    if (!formData.school_address) return 'School address is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      return 'Passwords do not match';
    return null;
  };

  const handleRegister = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Registration successful!');
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <Header
        title="Student Registration"
        showBack
        navigation={navigation}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-10">
          <InputField
            label="Full Name"
            value={formData.full_name}
            onChangeText={(value) => handleChange('full_name', value)}
            placeholder="Enter your full name"
          />

          <InputField
            label="Mobile Number"
            value={formData.mobile_no}
            onChangeText={(value) => handleChange('mobile_no', value)}
            placeholder="9876543210"
            keyboardType="phone-pad"
          />

          <InputField
            label="Email ID"
            value={formData.email_id}
            onChangeText={(value) => handleChange('email_id', value)}
            placeholder="student@example.com"
            keyboardType="email-address"
          />

          <InputField
            label="Class"
            value={formData.class}
            onChangeText={(value) => handleChange('class', value)}
            placeholder="e.g., 10th, 12th"
          />

          <InputField
            label="School Address"
            value={formData.school_address}
            onChangeText={(value) => handleChange('school_address', value)}
            placeholder="Enter your school address"
            multiline
            numberOfLines={3}
          />

          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            placeholder="Create a password"
            secureTextEntry
          />

          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            placeholder="Confirm your password"
            secureTextEntry
          />

          <CustomButton
            title="Register"
            onPress={handleRegister}
            loading={loading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <CustomButton
              title="Login"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentRegisterScreen;