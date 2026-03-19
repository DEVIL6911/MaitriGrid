import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditProfileScreen = ({ navigation }) => {
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setGender(data.gender || '');
      setDob(data.dob || '');
    } catch (e) {
      Alert.alert('Error', 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      await userAPI.updateProfile({ name, email, phone, gender, dob });
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Full Name', value: name, setter: setName, placeholder: 'Enter full name' },
    { label: 'Email', value: email, setter: setEmail, placeholder: 'Enter email', keyboardType: 'email-address' },
    { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Enter phone', keyboardType: 'phone-pad' },
    { label: 'Gender', value: gender, setter: setGender, placeholder: 'Enter gender' },
    { label: 'Date of Birth', value: dob, setter: setDob, placeholder: 'DD-MM-YYYY' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={COLORS.gray} />
          </View>
        </View>

        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <TextInput
              style={styles.fieldInput}
              value={field.value}
              onChangeText={field.setter}
              placeholder={field.placeholder}
              placeholderTextColor={COLORS.gray}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 56, paddingBottom: 16,
  },
  backBtn: { marginRight: 12 },
  title: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.text },
  content: { flex: 1, paddingHorizontal: SIZES.paddingLg },
  avatarSection: { alignItems: 'center', marginVertical: 16 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.grayLight,
    justifyContent: 'center', alignItems: 'center',
  },
  fieldContainer: { marginBottom: 20 },
  fieldLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginBottom: 6 },
  fieldInput: {
    fontSize: SIZES.lg, color: COLORS.text,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayLight, paddingVertical: 8,
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, alignItems: 'center', marginTop: 16, ...SHADOWS.button,
  },
  saveBtnText: { color: COLORS.white, fontSize: SIZES.lg, fontWeight: '600' },
});

export default EditProfileScreen;
