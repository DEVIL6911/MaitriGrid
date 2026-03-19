import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const SolarConnectedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={60} color={COLORS.primary} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Solar Connected</Text>
      <Text style={styles.subtitle}>
        Check all time energy consumption and solar energy production status
      </Text>

      {/* View Status Button */}
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.viewBtnText}>View Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingLg,
  },
  iconContainer: {
    marginBottom: 32,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  viewBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  viewBtnText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
});

export default SolarConnectedScreen;
