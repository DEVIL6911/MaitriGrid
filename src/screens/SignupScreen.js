import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept terms & conditions');
      return;
    }

    setLoading(true);
    try {
      await signup(phone.trim(), password);
      navigation.navigate('OTP', { phone: phone.trim() });
    } catch (e) {
      Alert.alert('Signup Failed', e.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/auth-header.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>

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
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={[styles.input, { marginLeft: 12 }]}
              placeholder="Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={[styles.input, { marginLeft: 12 }]}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
              {termsAccepted && (
                <Ionicons name="checkmark" size={14} color={COLORS.white} />
              )}
            </View>
            <Text style={styles.termsText}>
              I accept{' '}
              <Text style={styles.termsLink}>Terms & conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupBtn, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.signupBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <View style={styles.socialIcon}>
              <Ionicons name="logo-google" size={22} color="#DB4437" />
            </View>
            <View style={styles.socialIcon}>
              <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
            </View>
            <View style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={22} color="#4267B2" />
            </View>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { flexGrow: 1 },
  headerImage: { width: '100%', height: 200 },
  formContainer: { flex: 1, paddingHorizontal: SIZES.paddingLg, paddingTop: 20 },
  title: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text, marginBottom: 24 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.grayLight,
    paddingVertical: 12, marginBottom: 8,
  },
  countryCode: { fontSize: SIZES.md, color: COLORS.textSecondary, marginLeft: 8 },
  inputDivider: { width: 1, height: 20, backgroundColor: COLORS.grayLight, marginHorizontal: 10 },
  input: { flex: 1, fontSize: SIZES.md, color: COLORS.text },
  termsContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16, marginBottom: 24 },
  checkbox: {
    width: 20, height: 20, borderWidth: 2, borderColor: COLORS.grayLight,
    borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 1,
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { flex: 1, fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 18 },
  termsLink: { color: COLORS.primary, fontWeight: '600' },
  signupBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, alignItems: 'center', ...SHADOWS.button,
  },
  signupBtnText: { color: COLORS.white, fontSize: SIZES.lg, fontWeight: '600' },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 16 },
  socialIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center',
  },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 32 },
  loginText: { fontSize: SIZES.md, color: COLORS.textSecondary },
  loginLink: { fontSize: SIZES.md, color: COLORS.primary, fontWeight: '600' },
});

export default SignupScreen;
