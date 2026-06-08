import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity
} from 'react-native';
import api from '../services/api';
import Header from '../components/Header';
import StudentCard from '../components/StudentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AllStudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.students);
      setFilteredStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.mobile_no.includes(searchQuery)
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const handleStudentPress = (student) => {
    navigation.navigate('StudentDetail', { student });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="All Students" showBack navigation={navigation} />
      
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-white rounded-lg px-3 border border-gray-300">
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 py-3 px-2 text-base"
            placeholder="Search by name, email or mobile..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredStudents.length === 0 ? (
          <View className="py-10 items-center">
            <Icon name="people-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 text-lg mt-4">
              No students found
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-gray-500 text-sm mb-3">
              Total: {filteredStudents.length} students
            </Text>
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onPress={handleStudentPress}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AllStudentsScreen;