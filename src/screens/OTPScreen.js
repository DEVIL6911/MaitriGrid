import React, { useState, useRef } from 'react';
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
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const phone = route?.params?.phone || '';
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const { verifyOTP } = useAuth();

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the full 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(phone, otpString);
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Verification Failed', e.message || 'Invalid OTP');
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
        <Text style={styles.title}>OTP Validation</Text>
        <Text style={styles.subtitle}>We have sent OTP on your number {phone}</Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueBtn, loading && { opacity: 0.7 }]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.continueBtnText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive an OTP? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  headerImage: { width: '100%', height: 200 },
  content: { flex: 1, paddingHorizontal: SIZES.paddingLg, paddingTop: 32 },
  title: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40 },
  otpInput: {
    width: 52, height: 52, borderWidth: 1.5, borderColor: COLORS.grayLight,
    borderRadius: SIZES.radius, textAlign: 'center', fontSize: SIZES.xxl,
    fontWeight: '700', color: COLORS.text,
  },
  otpInputFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  continueBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, alignItems: 'center', ...SHADOWS.button,
  },
  continueBtnText: { color: COLORS.white, fontSize: SIZES.lg, fontWeight: '600' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  resendText: { fontSize: SIZES.md, color: COLORS.textSecondary },
  resendLink: { fontSize: SIZES.md, color: COLORS.primary, fontWeight: '600' },
});

export default OTPScreen;
