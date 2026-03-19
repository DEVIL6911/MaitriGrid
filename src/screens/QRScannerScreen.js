import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { solarAPI } from '../services/api';

const QRScannerScreen = ({ navigation }) => {
  const [connecting, setConnecting] = React.useState(false);

  const handleCapture = async () => {
    setConnecting(true);
    try {
      // Simulate QR scan with a demo code
      await solarAPI.connect('DEMO-QR-2024');
      navigation.replace('SolarConnected');
    } catch (e) {
      Alert.alert('Connection Failed', e.message || 'Could not connect solar device');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Scan the QR barcode on the Inverter</Text>

      <View style={styles.scannerContainer}>
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          {connecting ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Ionicons name="qr-code-outline" size={80} color="rgba(255,255,255,0.3)" />
          )}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="image-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} disabled={connecting}>
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="flash-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 56 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: SIZES.xl, fontWeight: '600', color: COLORS.white, textAlign: 'center', marginTop: 16, paddingHorizontal: SIZES.paddingLg },
  scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: 240, height: 240, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: COLORS.primary },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  bottomSection: { paddingBottom: 48, paddingHorizontal: 40 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
  },
  captureBtnInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.white },
});

export default QRScannerScreen;
