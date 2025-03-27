import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../../lib/AuthProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import Header from '../components/Header';

interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface Coin {
  name: string;
  quantity: number;
  currentPrice: number;
  balance: number;
  symbol: string;
  color: string;
  change: number;
  image?: string;
}

const { width } = Dimensions.get("window");
const CHART_SIZE = Math.min(width * 0.8, 300);

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

// Default colors in case API fails
const defaultColors = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  USDT: "#26A17B",
  BNB: "#F3BA2F",
  SOL: "#14F195",
  XRP: "#23292F",
  ADA: "#0033AD",
  DOGE: "#C2A633",
};

export default function WalletPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [userCoins, setUserCoins] = useState<Coin[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coinColors, setCoinColors] = useState<Record<string, string>>(defaultColors);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scaleAnim] = useState(new Animated.Value(1));

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchCoinColors();
        fetchUserCoins();
      }
    }, [user])
  );

  const fetchCoinColors = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false');
      const data = await response.json();
      
      const colors: Record<string, string> = {};
      data.forEach((coin: any) => {
        if (coin.symbol && coin.id) {
          colors[coin.symbol.toUpperCase()] = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        }
      });
      
      setCoinColors(colors);
    } catch (error) {
      console.error("Error fetching coin colors:", error);
      setCoinColors(defaultColors);
    }
  };

  const fetchCoinData = async (symbols: string[]) => {
    try {
      const vs_currency = 'usd';
      const symbolString = symbols.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&symbols=${symbolString}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      const data: CoinGeckoData[] = await response.json();
      return data.reduce((acc, coin) => {
        acc[coin.symbol.toUpperCase()] = {
          name: coin.name,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          image: coin.image
        };
        return acc;
      }, {} as Record<string, { name: string; price: number; change: number; image: string; }>);
    } catch (error) {
      console.error("Error fetching coin data:", error);
      return {};
    }
  };

  const fetchUserCoins = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const coinsRef = collection(db, "users", user.uid, "coins");
      const coinsSnapshot = await getDocs(coinsRef);
      
      const userCoinData = coinsSnapshot.docs.map(doc => ({
        symbol: doc.data().symbol?.toUpperCase() || "UNKNOWN",
        quantity: parseFloat(doc.data().quantity) || 0
      }));

      // Fetch updated coin data from CoinGecko
      const coinData = await fetchCoinData(userCoinData.map(coin => coin.symbol));
      
      let total = 0;
      const coins: Coin[] = [];

      for (const userCoin of userCoinData) {
        const { symbol, quantity } = userCoin;
        const geckoData = coinData[symbol];
        
        if (geckoData) {
          const currentPrice = geckoData.price;
          const balance = quantity * currentPrice;
          
          total += balance;
          
          coins.push({
            name: geckoData.name,
            symbol: symbol,
            quantity: quantity,
            currentPrice: currentPrice,
            balance: balance,
            color: defaultColors[symbol as keyof typeof defaultColors] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
            change: geckoData.change,
            image: geckoData.image
          });
        }
      }

      const sortedCoins = coins.sort((a, b) => b.balance - a.balance);
      
      setTotalBalance(total);
      setUserCoins(sortedCoins);
    } catch (error) {
      console.error("Error fetching user coins:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 4}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <View style={styles.tooltipContainer}>
          <Text style={styles.tooltipTitle}>{data.name}</Text>
          <Text style={styles.tooltipValue}>${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        </View>
      );
    }
    return null;
  };

  const renderPieChart = () => {
    const validCoins = userCoins.filter(coin => coin.balance > 0);
    
    if (validCoins.length === 0) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No coins to display</Text>
        </View>
      );
    }

    const chartData = validCoins.map(coin => ({
      name: coin.name,
      value: coin.balance,
      symbol: coin.symbol,
      color: coin.color,
      percentage: ((coin.balance / totalBalance) * 100).toFixed(1),
      quantity: coin.quantity,
      price: coin.currentPrice
    }));

    return (
      <Animated.View style={[styles.chartWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.chartContainer}>
          <ResponsiveContainer width={CHART_SIZE} height={CHART_SIZE}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    strokeWidth={1}
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </View>
        <View style={styles.chartLegend}>
          {chartData.map((entry, index) => (
            <TouchableOpacity
              key={`${entry.symbol}-${index}`}
              style={[
                styles.legendItem,
                activeIndex === index && styles.legendItemActive
              ]}
              onPress={() => setActiveIndex(index === activeIndex ? -1 : index)}
            >
              <View style={[styles.legendColor, { backgroundColor: entry.color }]} />
              <Text style={[
                styles.legendText,
                activeIndex === index && styles.legendTextActive
              ]}>
                {entry.name} ({entry.symbol}): {entry.percentage}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
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
      <Header 
        title="My Wallet"
        rightComponent={
          <TouchableOpacity onPress={() => {
            fetchCoinColors();
            fetchUserCoins();
          }}>
            <Feather name="refresh-ccw" size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.chartSection}>
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
            <TouchableOpacity 
              key={coin.symbol} 
              style={[
                styles.coinItem,
                activeIndex !== -1 && userCoins[activeIndex].symbol === coin.symbol && styles.coinItemActive
              ]}
              onPress={() => setActiveIndex(userCoins.findIndex(c => c.symbol === coin.symbol))}
            >
              <View style={styles.coinInfo}>
                {coin.image ? (
                  <Image 
                    source={{ uri: coin.image }} 
                    style={styles.coinImage}
                  />
                ) : (
                  <View style={[styles.colorDot, { backgroundColor: coin.color }]} />
                )}
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
            </TouchableOpacity>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  balanceContainer: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  chartSection: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    width: CHART_SIZE,
    height: CHART_SIZE * 0.8,
    marginBottom: 12,
  },
  chartLegend: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  coinsList: {
    padding: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 8,
    color: "#000",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    margin: 16,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
  },
  coinImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  coinItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coinItemActive: {
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  coinInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  coinName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
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
    color: "#000",
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
  emptyChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyChartText: {
    marginTop: 16,
    color: "#666",
    fontSize: 16,
  },
  tooltipContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  tooltipValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  legendItemActive: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    transform: [{ scale: 1.02 }],
  },
  legendTextActive: {
    fontWeight: 'bold',
    color: '#000',
  },
});