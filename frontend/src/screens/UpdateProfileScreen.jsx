import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

const UpdateProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_no: '',
    class: '',
    school_address: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      const profile = response.data.user;
      setFormData({
        full_name: profile.full_name,
        mobile_no: profile.mobile_no,
        class: profile.class,
        school_address: profile.school_address
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async () => {
    if (!formData.full_name || !formData.mobile_no || !formData.class || !formData.school_address) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    setUpdating(true);
    try {
      await api.put('/auth/profile', formData);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <Header title="Update Profile" showBack navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-6">
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

          <CustomButton
            title="Update Profile"
            onPress={handleUpdate}
            loading={updating}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfileScreen;