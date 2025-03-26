import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { AntDesign, Feather } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { Link } from 'expo-router';

export default function WalletPage() {
  const { colors } = useTheme();
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateChart(true), 100);
  }, []);

  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', percentage: 52, color: colors.primary },
    { name: 'Ethereum', symbol: 'ETH', percentage: 24, color: '#16bc5a' },
    { name: 'Litecoin', symbol: 'LTC', percentage: 16, color: '#9333ea' },
    { name: 'Monero', symbol: 'XMR', percentage: 8, color: '#ef4444' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Feather name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>My Assets</Text>
        <Avatar.Image size={32} source={{ uri: "https://via.placeholder.com/32" }} />

      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.subText}>Total Balance</Text>
        <Text style={styles.balance}>$23,768.42</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg height="200" width="200" viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="40" stroke={colors.border} strokeWidth="10" fill="transparent" />
          {assets.map((asset, index) => {
            const strokeDasharray = 251.2;
            const strokeDashoffset = animateChart ? ((100 - asset.percentage) / 100) * 251.2 : 251.2;
            return (
              <Circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                stroke={asset.color}
                strokeWidth="10"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
              />
            );
          })}
        </Svg>
        <Text style={styles.chartText}>%52 BTC</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.actionButton}><AntDesign name="plus" size={24} color="white" /></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Feather name="arrow-down" size={24} color="white" /></TouchableOpacity>
      </View>

      <View style={styles.assetsList}>
        {assets.map((asset, index) => (
          <View key={index} style={styles.assetItem}>
            <View style={[styles.colorDot, { backgroundColor: asset.color }]} />
            <View>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.subText}>%{asset.percentage}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  balanceContainer: { alignItems: 'center', marginBottom: 20 },
  balance: { fontSize: 24, fontWeight: 'bold' },
  subText: { fontSize: 14, color: 'gray' },
  chartContainer: { alignItems: 'center', marginBottom: 20 },
  chartText: { position: 'absolute', fontSize: 18, fontWeight: 'bold' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 },
  actionButton: { width: 50, height: 50, backgroundColor: 'blue', borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  assetsList: { gap: 10 },
  assetItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  assetName: { fontSize: 16, fontWeight: 'bold' },
});
