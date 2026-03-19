import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { authAPI } from '../services/api';

const ForgotPasswordScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(phone.trim(), newPassword);
      Alert.alert('Success', 'Password updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/auth-header.png')}
        style={styles.headerImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color={COLORS.gray} />
          <Text style={styles.countryCode}>+91</Text>
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={COLORS.gray}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={[styles.input, { marginLeft: 12 }]}
            placeholder="New Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitBtnText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  headerImage: { width: '100%', height: 200 },
  content: { flex: 1, paddingHorizontal: SIZES.paddingLg, paddingTop: 32 },
  title: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text, marginBottom: 32 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.grayLight,
    paddingVertical: 12, marginBottom: 16,
  },
  countryCode: { fontSize: SIZES.md, color: COLORS.textSecondary, marginLeft: 8 },
  inputDivider: { width: 1, height: 20, backgroundColor: COLORS.grayLight, marginHorizontal: 10 },
  input: { flex: 1, fontSize: SIZES.md, color: COLORS.text },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, alignItems: 'center', marginTop: 16, ...SHADOWS.button,
  },
  submitBtnText: { color: COLORS.white, fontSize: SIZES.lg, fontWeight: '600' },
  backBtn: { alignItems: 'center', marginTop: 20 },
  backText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});

export default ForgotPasswordScreen;
