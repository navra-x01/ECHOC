import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Avatar } from "react-native-elements";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { useAuth } from "../lib/AuthProvider";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Feather } from "@expo/vector-icons";

import CryptoCard from "../app/components/CryptoCard";
import CoinCard from "../app/components/CoinCard";
import TrendingCard from "../app/components/TrendingCard";
import ProtectedRoute from "../app/components/ProtectedRoute";
import Header from "../app/components/Header";

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface UserCoin {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  currentPrice: number;
  balance: number;
  change: number;
  image: string;
  color: string;
}

const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState<UserCoin[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchUserCoins();
      }
    }, [user])
  );

  useEffect(() => {
    fetchTrendingCoins();
  }, []);

  const fetchUserCoins = async () => {
    try {
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
      let totalChange = 0;
      let totalWeight = 0;
      const coins: UserCoin[] = [];

      for (const userCoin of userCoinData) {
        const { symbol, quantity } = userCoin;
        const geckoData = coinData[symbol];
        
        if (geckoData) {
          const currentPrice = geckoData.price;
          const balance = quantity * currentPrice;
          
          total += balance;
          totalChange += geckoData.change * balance;
          totalWeight += balance;
          
          coins.push({
            id: geckoData.id,
            name: geckoData.name,
            symbol: symbol,
            quantity: quantity,
            currentPrice: currentPrice,
            balance: balance,
            change: geckoData.change,
            image: geckoData.image,
            color: getCoinColor(symbol)
          });
        }
      }

      const sortedCoins = coins.sort((a, b) => b.balance - a.balance);
      
      setTotalBalance(total);
      // Calculate weighted average portfolio change
      setPortfolioChange(totalWeight > 0 ? totalChange / totalWeight : 0);
      setUserCoins(sortedCoins);
    } catch (error) {
      console.error("Error fetching user coins:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoinData = async (symbols: string[]) => {
    try {
      const vs_currency = 'usd';
      const symbolString = symbols.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&symbols=${symbolString}&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${API_KEY}`
      );
      const data = await response.json();
      return data.reduce((acc: any, coin: any) => {
        acc[coin.symbol.toUpperCase()] = {
          name: coin.name,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          image: coin.image,
          id: coin.id
        };
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching coin data:", error);
      return {};
    }
  };

  const getCoinColor = (symbol: string): string => {
    const colors: Record<string, string> = {
      BTC: "#F7931A",
      ETH: "#627EEA",
      USDT: "#26A17B",
      BNB: "#F3BA2F",
      SOL: "#14F195",
      XRP: "#23292F",
      ADA: "#0033AD",
      DOGE: "#C2A633",
    };
    return colors[symbol] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
  };

  const fetchTrendingCoins = async () => {
    try {
      setLoading(true);
      const TRENDING_API = `https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${API_KEY}`;
      const response = await fetch(TRENDING_API);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending coins');
      }
      
      const data = await response.json();
      const trendingIds = data.coins.map((item: any) => item.item.id).join(',');
      
      // Fetch detailed data for trending coins
      const MARKET_API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trendingIds}&order=market_cap_desc&sparkline=false&x_cg_demo_api_key=${API_KEY}`;
      const marketResponse = await fetch(MARKET_API);
      
      if (!marketResponse.ok) {
        throw new Error('Failed to fetch trending coin details');
      }
      
      const marketData = await marketResponse.json();
      setTrendingCoins(marketData);
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      setError('Failed to load trending coins');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <ProtectedRoute>
        <Header 
          title="Home"
          rightComponent={
            <TouchableOpacity onPress={fetchUserCoins}>
              <Feather name="refresh-ccw" size={20} color={colors.text} />
            </TouchableOpacity>
          }
        />
        <View style={{ padding: 16 }}>
          {/* First Box - Portfolio Overview */}
          <View style={styles.portfolioBox}>
            <View style={styles.portfolioHeader}>
              <Text style={[styles.portfolioTitle, { color: colors.text }]}>Portfolio Overview</Text>
            </View>
            <View style={styles.portfolioContent}>
              <Text style={[styles.totalBalance, { color: colors.text }]}>
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <View style={styles.portfolioChange}>
                <Text style={[
                  styles.changeText,
                  { color: portfolioChange >= 0 ? '#16bc5a' : '#ef4444' }
                ]}>
                  {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
                </Text>
                <Text style={[styles.changeLabel, { color: colors.text }]}>24h Change</Text>
              </View>
            </View>
          </View>

          {/* My Coins Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16, color: colors.text }}>
              My Coins
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userCoins.length === 0 ? (
                <View style={{ 
                  backgroundColor: colors.card,
                  padding: 20,
                  borderRadius: 12,
                  marginRight: 12,
                  width: 200,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{ color: colors.text, opacity: 0.7 }}>No coins yet</Text>
                </View>
              ) : (
                userCoins.map((coin) => (
                  <TouchableOpacity
                    key={coin.symbol}
                    onPress={() => router.push(`/coin?id=${coin.id}`)}
                    style={{
                      backgroundColor: colors.card,
                      padding: 16,
                      borderRadius: 12,
                      marginRight: 12,
                      width: 200,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      {coin.image ? (
                        <Image 
                          source={{ uri: coin.image }} 
                          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                        />
                      ) : (
                        <View style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 16, 
                          backgroundColor: coin.color,
                          marginRight: 8
                        }} />
                      )}
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>
                          {coin.symbol}
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7 }}>
                          {coin.name}
                        </Text>
                      </View>
                    </View>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7, marginBottom: 4 }}>
                        Quantity
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>
                        {coin.quantity.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7, marginBottom: 4 }}>
                        Value
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>
                        ${coin.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ 
                        fontSize: 14, 
                        color: colors.text, 
                        opacity: 0.7 
                      }}>
                        {((coin.balance / totalBalance) * 100).toFixed(1)}%
                      </Text>
                      <Text style={{ 
                        color: coin.change >= 0 ? '#16bc5a' : '#ef4444',
                        fontSize: 14,
                        fontWeight: "bold"
                      }}>
                        {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>

          {/* Existing Trending Section */}
          <View style={{ marginTop: 24, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>Hot Right Now</Text>
                <Text style={{ fontSize: 14, color: colors.text, opacity: 0.7, marginTop: 4 }}>Most searched cryptocurrencies in the last 24 hours</Text>
              </View>
              <TouchableOpacity onPress={() => fetchTrendingCoins()}>
                <Text style={{ color: "#00bdb0", fontSize: 14 }}>Refresh</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="small" color="#00bdb0" />
            ) : error ? (
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            ) : (
              <View>
                {trendingCoins.map((coin) => (
                  <TouchableOpacity
                    key={coin.id}
                    onPress={() => router.push(`/coin?id=${coin.id}`)}
                    style={{
                      backgroundColor: colors.card,
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Avatar
                        rounded
                        source={{ uri: coin.image }}
                        size={40}
                        containerStyle={{ marginRight: 12 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>{coin.name}</Text>
                        <Text style={{ fontSize: 14, opacity: 0.6, color: colors.text }}>({coin.symbol.toUpperCase()})</Text>
                      </View>
                      <Text style={{ 
                        color: coin.price_change_percentage_24h >= 0 ? '#16bc5a' : '#ef4444',
                        fontSize: 14,
                        fontWeight: "bold"
                      }}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ProtectedRoute>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  portfolioBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  portfolioContent: {
    alignItems: 'center',
  },
  totalBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
});


