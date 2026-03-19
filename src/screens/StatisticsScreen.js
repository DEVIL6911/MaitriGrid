import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { statisticsAPI, energyAPI } from '../services/api';

const screenWidth = Dimensions.get('window').width;
const TIME_FILTERS = ['Day', 'Week', 'Month', 'All Time'];

const StatisticsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Month');
  const [isSolar, setIsSolar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState({ total_generated: 0, data: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        statisticsAPI.get(),
        energyAPI.getHistory(),
      ]);
      setStats(statsData);
      setHistory(historyData);
    } catch (e) {
      console.log('Statistics fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const savedPercent = stats?.electricity_saved_percent || 0;

  const chartLabels = history.data.length > 0
    ? history.data.map(d => d.time).slice(0, 4)
    : ['Mar', 'Apr', 'May', 'Jun'];

  const chartData = history.data.length > 0
    ? history.data.map(d => d.kwh)
    : [30, 55, 45, 70];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Switch
          value={isSolar}
          onValueChange={setIsSolar}
          trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
          thumbColor={isSolar ? COLORS.primary : COLORS.gray}
        />
      </View>

      {/* Donut Chart Section */}
      <View style={styles.donutSection}>
        <Text style={styles.sectionTitle}>Electricity Saved</Text>
        <View style={styles.donutContainer}>
          <View style={styles.donutOuter}>
            <View style={styles.donutInner}>
              <Ionicons name="flash" size={28} color={COLORS.primary} />
              <Text style={styles.donutPercent}>{Math.round(savedPercent)}%</Text>
              <Text style={styles.donutLabel}>Electricity</Text>
            </View>
          </View>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>Electricity</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
            <Text style={styles.legendText}>Solar energy</Text>
          </View>
        </View>
        <Text style={styles.savedText}>{Math.round(savedPercent)}% electricity saved</Text>
      </View>

      {/* Energy Generated Section */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Energy generated</Text>
        <View style={styles.energyInfo}>
          <Text style={styles.energyValue}>{history.total_generated.toFixed(3)}KWh</Text>
          <View style={styles.trendBadge}>
            <Ionicons name="arrow-up" size={12} color={COLORS.primary} />
            <Text style={styles.trendText}>4.2 from last</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {TIME_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterBtn, activeFilter === filter && styles.filterBtnActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <LineChart
          data={{
            labels: chartLabels,
            datasets: [{
              data: chartData.length > 0 ? chartData : [0],
              color: (opacity = 1) => `rgba(73, 176, 45, ${opacity})`,
              strokeWidth: 2,
            }],
          }}
          width={screenWidth - 64}
          height={180}
          chartConfig={{
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(73, 176, 45, ${opacity})`,
            labelColor: () => COLORS.gray,
            propsForDots: { r: '0' },
            propsForBackgroundLines: { stroke: COLORS.grayLight, strokeDasharray: '4' },
          }}
          bezier
          withDots={false}
          withInnerLines={true}
          withOuterLines={false}
          style={styles.chart}
        />
      </View>

      {/* Solar Power Stats */}
      <View style={styles.solarStatsSection}>
        <View style={styles.solarHeader}>
          <View style={styles.solarIcon}>
            <Ionicons name="sunny" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.solarLabel}>Solar power</Text>
        </View>
        <View style={styles.solarCards}>
          <View style={styles.solarCard}>
            <Text style={styles.solarCardValue}>{stats?.solar_value_kwh?.toFixed(0) || 0}kwh</Text>
            <Text style={styles.solarCardLabel}>Value</Text>
          </View>
          <View style={styles.solarCard}>
            <Text style={styles.solarCardValue}>{stats?.solar_produced_kwh?.toFixed(0) || 0}kwh</Text>
            <Text style={styles.solarCardLabel}>Produced</Text>
          </View>
          <View style={styles.solarCard}>
            <Text style={styles.solarCardValue}>{stats?.solar_consumed_kwh?.toFixed(0) || 0}kwh</Text>
            <Text style={styles.solarCardLabel}>Consumed</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.paddingLg, paddingTop: 56, paddingBottom: 16, backgroundColor: COLORS.white,
  },
  title: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text },
  donutSection: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding, marginTop: 12,
    borderRadius: SIZES.radiusLg, padding: SIZES.padding, alignItems: 'center', ...SHADOWS.card,
  },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: '600', color: COLORS.text, alignSelf: 'flex-start', marginBottom: 16 },
  donutContainer: { marginVertical: 8 },
  donutOuter: {
    width: 160, height: 160, borderRadius: 80, borderWidth: 16, borderColor: COLORS.danger,
    justifyContent: 'center', alignItems: 'center',
    borderTopColor: COLORS.primary, borderRightColor: COLORS.primary, borderBottomColor: COLORS.primary,
    transform: [{ rotate: '-45deg' }],
  },
  donutInner: { alignItems: 'center', transform: [{ rotate: '45deg' }] },
  donutPercent: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  donutLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary },
  legend: { flexDirection: 'row', gap: 20, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  savedText: { fontSize: SIZES.md, color: COLORS.textSecondary, marginTop: 8 },
  chartSection: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding, marginTop: 12,
    borderRadius: SIZES.radiusLg, padding: SIZES.padding, ...SHADOWS.card,
  },
  energyInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  energyValue: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.text },
  trendBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 2,
  },
  trendText: { fontSize: SIZES.xs, color: COLORS.primary, fontWeight: '500' },
  filterContainer: {
    flexDirection: 'row', backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusFull, padding: 3, marginBottom: 12,
  },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: SIZES.radiusFull },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: SIZES.sm, color: COLORS.textSecondary, fontWeight: '500' },
  filterTextActive: { color: COLORS.white, fontWeight: '600' },
  chart: { marginLeft: -16, borderRadius: 8 },
  solarStatsSection: {
    backgroundColor: COLORS.white, marginHorizontal: SIZES.padding, marginTop: 12,
    borderRadius: SIZES.radiusLg, padding: SIZES.padding, ...SHADOWS.card,
  },
  solarHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  solarIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  solarLabel: { fontSize: SIZES.md, color: COLORS.textSecondary },
  solarCards: { flexDirection: 'row', gap: 8 },
  solarCard: { flex: 1, backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: 12, alignItems: 'center' },
  solarCardValue: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.text },
  solarCardLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
});

export default StatisticsScreen;
