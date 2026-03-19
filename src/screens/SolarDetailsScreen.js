import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const SolarDetailsScreen = ({ navigation }) => {
  const [modelNumber, setModelNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [meterNumber, setMeterNumber] = useState('');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Illustration */}
      <Image
        source={require('../../assets/solar-illustration.png')}
        style={styles.headerImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Update Solar Details</Text>

        {/* Model Number */}
        <View style={styles.inputContainer}>
          <Ionicons name="hardware-chip-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.input}
            placeholder="Solar Model Number"
            placeholderTextColor={COLORS.gray}
            value={modelNumber}
            onChangeText={setModelNumber}
          />
        </View>

        {/* Capacity */}
        <View style={styles.inputContainer}>
          <Ionicons name="flash-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.input}
            placeholder="Capacity(watts or Kilowatts)"
            placeholderTextColor={COLORS.gray}
            value={capacity}
            onChangeText={setCapacity}
          />
        </View>

        {/* Meter Number */}
        <View style={styles.inputContainer}>
          <Ionicons name="speedometer-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.input}
            placeholder="Meter Number"
            placeholderTextColor={COLORS.gray}
            value={meterNumber}
            onChangeText={setMeterNumber}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Details</Text>
        </TouchableOpacity>

        {/* QR Link */}
        <TouchableOpacity
          style={styles.qrLink}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.qrLinkText}>
            Or <Text style={styles.qrLinkBold}>click here</Text> to scan barcode to connect(check it on inverter)
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  content: {
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingVertical: 14,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    marginLeft: 12,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
    ...SHADOWS.button,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  qrLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  qrLinkText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  qrLinkBold: {
    fontWeight: '700',
    color: COLORS.text,
  },
});

export default SolarDetailsScreen;
