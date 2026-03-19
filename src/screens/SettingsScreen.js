import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { label: 'Account', icon: 'person-outline', screen: 'Account' },
  { label: 'Solar Details', icon: 'sunny-outline', screen: 'SolarIntegration' },
  { label: 'Contact Us', icon: 'call-outline', screen: null },
  { label: 'Terms & Conditions', icon: 'document-text-outline', screen: null },
  { label: 'Privacy Policy', icon: 'shield-checkmark-outline', screen: null },
  { label: 'About', icon: 'information-circle-outline', screen: null },
];

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.getParent()?.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={22} color={COLORS.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={[styles.menuLabel, { color: COLORS.danger }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SIZES.paddingLg, paddingTop: 56, paddingBottom: 16, backgroundColor: COLORS.white },
  title: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text },
  content: { flex: 1, paddingTop: 8 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.paddingLg, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayLight,
  },
  menuLabel: { flex: 1, fontSize: SIZES.lg, color: COLORS.text, marginLeft: 16 },
});

export default SettingsScreen;
