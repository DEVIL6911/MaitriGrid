import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { marketplaceAPI, transactionsAPI } from '../services/api';

const EnergyCard = React.memo(({ name, energy, price, onBuy, buying }) => (
  <View style={styles.energyCard}>
    <View style={styles.cardHeader}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={22} color={COLORS.primary} />
      </View>
      <Text style={styles.cardName}>{name}</Text>
    </View>
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Amount :</Text>
        <Text style={styles.detailValue}>{energy}kWh</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Price per kWh:</Text>
        <Text style={styles.detailValue}>Rs {price} Rs</Text>
      </View>
    </View>
    <TouchableOpacity
      style={[styles.buyBtn, buying && { opacity: 0.7 }]}
      onPress={onBuy}
      disabled={buying}
    >
      {buying ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text style={styles.buyBtnText}>Buy Now</Text>
      )}
    </TouchableOpacity>
  </View>
));

const TradeHistoryItem = React.memo(({ name, amount }) => (
  <View style={styles.tradeItem}>
    <View style={styles.avatar}>
      <Ionicons name="person-outline" size={20} color={COLORS.primary} />
    </View>
    <Text style={styles.tradeName}>{name}</Text>
    <Text style={styles.tradeAmount}>Rs {amount} Rs</Text>
  </View>
));

const MarketplaceScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('buy');
  const [isSolar, setIsSolar] = useState(true);
  const [listings, setListings] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buyingId, setBuyingId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [listingsData, tradesData] = await Promise.all([
        marketplaceAPI.getListings(),
        transactionsAPI.getAll().catch(() => []),
      ]);
      setListings(listingsData);
      setTrades(tradesData);
    } catch (e) {
      console.log('Marketplace fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBuy = async (listingId) => {
    Alert.alert(
      'Confirm Purchase',
      'Are you sure you want to buy this energy?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            setBuyingId(listingId);
            try {
              const result = await marketplaceAPI.buyEnergy(listingId);
              Alert.alert('Success', result.message);
              fetchData(); // Refresh listings
            } catch (e) {
              Alert.alert('Purchase Failed', e.message || 'Could not complete purchase');
            } finally {
              setBuyingId(null);
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

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
        <View>
          <Text style={styles.greeting}>Hi {user?.name || 'User'}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <View style={styles.toggleContainer}>
          <Switch
            value={isSolar}
            onValueChange={setIsSolar}
            trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
            thumbColor={isSolar ? COLORS.primary : COLORS.gray}
          />
          <Text style={styles.toggleLabel}>Switch to solar energy</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>
          {activeTab === 'buy' ? 'Energy Marketplace' : 'Your Trade History'}
        </Text>
        <Text style={styles.pageSubtitle}>
          Trade renewable energy with your community
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buy' && styles.tabActive]}
          onPress={() => setActiveTab('buy')}
        >
          <Text style={[styles.tabText, activeTab === 'buy' && styles.tabTextActive]}>
            Buy Energy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Trade History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {activeTab === 'buy' ? (
          listings.length > 0 ? (
            listings.map((listing) => (
              <EnergyCard
                key={listing.id}
                name={listing.seller_name}
                energy={listing.energy_kwh}
                price={listing.price_per_kwh}
                onBuy={() => handleBuy(listing.id)}
                buying={buyingId === listing.id}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="flash-off-outline" size={48} color={COLORS.gray} />
              <Text style={styles.emptyText}>No energy listings available</Text>
            </View>
          )
        ) : trades.length > 0 ? (
          trades.map((trade) => (
            <TradeHistoryItem
              key={trade.id}
              name={trade.user}
              amount={trade.amount}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>No Trade History</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: SIZES.paddingLg, paddingTop: 56, paddingBottom: 8, backgroundColor: COLORS.white,
  },
  greeting: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.text },
  date: { fontSize: SIZES.sm, color: COLORS.primary, marginTop: 2 },
  toggleContainer: { alignItems: 'center' },
  toggleLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  titleSection: { paddingHorizontal: SIZES.paddingLg, paddingVertical: 12, backgroundColor: COLORS.white },
  pageTitle: { fontSize: SIZES.xxxl, fontWeight: '700', color: COLORS.text },
  pageSubtitle: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  tabContainer: {
    flexDirection: 'row', marginHorizontal: SIZES.paddingLg, marginTop: 16,
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusFull, padding: 4, ...SHADOWS.card,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: SIZES.radiusFull },
  tabActive: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.text },
  tabText: { fontSize: SIZES.md, color: COLORS.textSecondary, fontWeight: '500' },
  tabTextActive: { color: COLORS.text, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: SIZES.paddingLg, marginTop: 16 },
  energyCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    padding: SIZES.padding, marginBottom: 12, ...SHADOWS.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardName: { fontSize: SIZES.lg, fontWeight: '600', color: COLORS.text },
  cardDetails: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailLabel: { fontSize: SIZES.md, color: COLORS.textSecondary },
  detailValue: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.text },
  buyBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 10, paddingHorizontal: 24, alignSelf: 'flex-end',
  },
  buyBtnText: { color: COLORS.white, fontSize: SIZES.md, fontWeight: '600' },
  tradeItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg, padding: SIZES.padding, marginBottom: 10, ...SHADOWS.card,
  },
  tradeName: { flex: 1, fontSize: SIZES.lg, fontWeight: '500', color: COLORS.text },
  tradeAmount: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.text },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, fontSize: SIZES.md, marginTop: 12 },
});

export default MarketplaceScreen;
