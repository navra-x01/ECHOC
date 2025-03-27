import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../../lib/AuthProvider';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface Coin {
  name: string;
  quantity: number;
  currentPrice: number;
  balance: number;
  symbol: string;
  color: string;
  change: number;
}

const { width } = Dimensions.get("window");
const CHART_SIZE = Math.min(width * 0.8, 300);
const RADIUS = CHART_SIZE / 3;
const CENTER = CHART_SIZE / 2;

// Mapping of coin symbols to their full names
const COIN_NAMES = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  BNB: "Binance Coin",
  SOL: "Solana",
  XRP: "Ripple",
  ADA: "Cardano",
  DOGE: "Dogecoin",
};

const coinColors = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  USDT: "#26A17B",
  BNB: "#F3BA2F",
  SOL: "#14F195",
  XRP: "#23292F",
  ADA: "#0033AD",
  DOGE: "#C2A633",
};

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadians: number) {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function createArc(startAngle: number, endAngle: number): string {
  // Ensure angles are between 0 and 2π
  startAngle = startAngle % (2 * Math.PI);
  endAngle = endAngle % (2 * Math.PI);
  
  const start = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  
  // Determine if the arc should be drawn the long way around
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  
  // Create the SVG arc path
  return `
    M ${CENTER} ${CENTER}
    L ${start.x} ${start.y}
    A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    Z
  `.trim();
}

export default function WalletPage() {
  const router = useRouter();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [userCoins, setUserCoins] = useState<Coin[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCoins();
    }
  }, [user]);

  const fetchUserCoins = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const coinsRef = collection(db, "users", user.uid, "coins");
      const coinsSnapshot = await getDocs(coinsRef);
      
      let total = 0;
      const coins: Coin[] = [];

      for (const doc of coinsSnapshot.docs) {
        const data = doc.data();
        // Get the proper coin symbol from the data
        const symbol = data.symbol?.toUpperCase() || "UNKNOWN";
        const quantity = parseFloat(data.quantity) || 0;
        const currentPrice = parseFloat(data.currentPrice) || 0;
        const balance = quantity * currentPrice;
        
        // Only add coins with non-zero quantity
        if (quantity > 0) {
          total += balance;
          
          coins.push({
            name: COIN_NAMES[symbol as keyof typeof COIN_NAMES] || data.name || symbol,
            symbol: symbol,
            quantity: quantity,
            currentPrice: currentPrice,
            balance: balance,
            color: coinColors[symbol as keyof typeof coinColors] || "#808080",
            change: parseFloat(data.change) || 0
          });
        }
      }

      // Sort coins by balance in descending order
      const sortedCoins = coins.sort((a, b) => b.balance - a.balance);
      
      setTotalBalance(total);
      setUserCoins(sortedCoins);
    } catch (error) {
      console.error("Error fetching user coins:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPieChart = () => {
    const validCoins = userCoins.filter(coin => coin.balance > 0);
    
    if (validCoins.length === 0) {
      return (
        <Svg width={CHART_SIZE} height={CHART_SIZE} style={styles.chart}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="#f0f0f0"
          />
        </Svg>
      );
    }
    
    let startAngle = -Math.PI / 2; // Start from top
    const total = validCoins.reduce((sum, coin) => sum + coin.balance, 0);
    
    return (
      <Svg width={CHART_SIZE} height={CHART_SIZE} style={styles.chart}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="#f0f0f0"
        />
        <G>
          {validCoins.map((coin) => {
            const percentage = coin.balance / total;
            const sweepAngle = 2 * Math.PI * percentage;
            const endAngle = startAngle + sweepAngle;
            const path = createArc(startAngle, endAngle);
            
            const currentPath = path;
            startAngle = endAngle;
            
            return (
              <Path
                key={coin.symbol}
                d={currentPath}
                fill={coin.color}
                stroke="white"
                strokeWidth={1}
              />
            );
          })}
        </G>
      </Svg>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Wallet</Text>
        <TouchableOpacity onPress={() => fetchUserCoins()}>
          <Feather name="refresh-ccw" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Wallet</Text>
        <TouchableOpacity onPress={() => fetchUserCoins()}>
          <Feather name="refresh-ccw" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        {renderPieChart()}
      </View>

      <View style={styles.coinsList}>
        <Text style={styles.sectionTitle}>My Coins</Text>
        {userCoins.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No coins in wallet</Text>
          </View>
        ) : (
          userCoins.map((coin) => (
            <View key={coin.symbol} style={styles.coinItem}>
              <View style={styles.coinInfo}>
                <View style={[styles.colorDot, { backgroundColor: coin.color }]} />
                <View>
                  <Text style={styles.coinName}>{coin.name}</Text>
                  <Text style={styles.coinSymbol}>
                    {coin.symbol} • ${coin.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
              <View style={styles.coinBalance}>
                <View style={styles.coinMainInfo}>
                  <Text style={styles.coinQuantity}>
                    {coin.quantity.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </Text>
                  <View style={styles.coinValueContainer}>
                    <Text style={[styles.coinChange, { color: coin.change >= 0 ? '#16bc5a' : '#ef4444' }]}>
                      {coin.change >= 0 ? '+' : ''}{coin.change}%
                    </Text>
                    <Text style={styles.coinValue}>
                      ${coin.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  balanceContainer: {
    alignItems: "center",
    padding: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 8,
  },
  chartContainer: {
    height: CHART_SIZE,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  chart: {
    alignSelf: "center",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
  },
  coinsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  coinItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  coinInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  coinName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  coinSymbol: {
    fontSize: 14,
    color: "#666",
  },
  coinBalance: {
    alignItems: "flex-end",
  },
  coinMainInfo: {
    alignItems: "flex-end",
  },
  coinQuantity: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "right",
  },
  coinValueContainer: {
    alignItems: "flex-end",
  },
  coinChange: {
    fontSize: 14,
    marginBottom: 4,
  },
  coinValue: {
    fontSize: 14,
    color: "#666",
  },
});