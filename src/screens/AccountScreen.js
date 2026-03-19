import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { userAPI } from '../services/api';

const ACCOUNT_ITEMS = [
  { label: 'General info', icon: 'person-outline' },
  { label: 'Password', icon: 'lock-closed-outline' },
  { label: 'Contact info', icon: 'call-outline' },
  { label: 'Wallet Balance', icon: 'wallet-outline' },
];

const AccountScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setProfile(data);
    } catch (e) {
      console.log('Profile fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Banner */}
        <View style={styles.profileBanner}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={36} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name || 'User'}</Text>
            <Text style={styles.profileDetail}>Gender - {profile?.gender || 'N/A'}</Text>
            <Text style={styles.profileDetail}>Age - {profile?.age || 'N/A'} year</Text>
          </View>
        </View>

        {/* Account Details */}
        <Text style={styles.sectionTitle}>Account Details</Text>

        {ACCOUNT_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.label === 'General info') {
                navigation.navigate('EditProfile');
              }
            }}
          >
            <Ionicons name={item.icon} size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 56, paddingBottom: 16, backgroundColor: COLORS.white,
  },
  backBtn: { marginRight: 12 },
  title: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.text },
  content: { flex: 1 },
  profileBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.padding, marginTop: 16, borderRadius: SIZES.radiusLg, padding: SIZES.padding,
  },
  avatarLarge: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  profileDetail: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.85)' },
  sectionTitle: {
    fontSize: SIZES.lg, fontWeight: '600', color: COLORS.text,
    paddingHorizontal: SIZES.paddingLg, marginTop: 24, marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.paddingLg, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayLight,
  },
  menuLabel: { flex: 1, fontSize: SIZES.lg, color: COLORS.text, marginLeft: 16 },
});

export default AccountScreen;
