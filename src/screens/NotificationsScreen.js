import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const NOTIFICATION_ITEMS = [
  { label: 'Charging Issues', icon: 'battery-charging-outline' },
  { label: 'Inverter Issues', icon: 'hardware-chip-outline' },
  { label: 'Weather Forecast', icon: 'cloud-outline' },
  { label: 'Energy Saving Suggestion', icon: 'bulb-outline' },
  { label: 'Charging Updates', icon: 'refresh-outline' },
  { label: 'Connection Help', icon: 'help-circle-outline' },
];

const NotificationsScreen = () => {
  const [toggles, setToggles] = useState(
    NOTIFICATION_ITEMS.reduce((acc, item) => ({ ...acc, [item.label]: false }), {})
  );

  const toggleSwitch = (label) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Push Notifications</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {NOTIFICATION_ITEMS.map((item, index) => (
          <View key={index} style={styles.notifItem}>
            <Ionicons name={item.icon} size={22} color={COLORS.textSecondary} />
            <Text style={styles.notifLabel}>{item.label}</Text>
            <Switch
              value={toggles[item.label]}
              onValueChange={() => toggleSwitch(item.label)}
              trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
              thumbColor={toggles[item.label] ? COLORS.primary : COLORS.gray}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.paddingLg,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  notifLabel: {
    flex: 1,
    fontSize: SIZES.lg,
    color: COLORS.text,
    marginLeft: 16,
  },
});

export default NotificationsScreen;
