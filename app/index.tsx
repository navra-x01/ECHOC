import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "react-native-elements";

import CryptoCard from "../app/components/CryptoCard";
import CoinCard from "../app/components/CoinCard";
import TrendingCard from "../app/components/TrendingCard";
import ProtectedRoute from "../app/components/ProtectedRoute";

interface TrendingCoin {
  id: string;
  symbol: string;
  name: string;
  price_change_percentage_24h: number;
  image: string;
}

const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";

export default function HomePage() {
  const router = useRouter();
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingCoins();
  }, []);

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
    <ProtectedRoute>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
          Trade Now and Get{"\n"}Your Life
        </Text>

        <CryptoCard total="$7,273,291" profit="$193,28" percentage="2.41%" />

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>My Coins 😎</Text>
            <TouchableOpacity>
              <Text style={{ color: "#00bdb0", fontSize: 14 }}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <CoinCard symbol="₿" name="BTC" price="$24,209" percentage="-6.21%" color="#F7931A" />
            <CoinCard
              symbol="Ξ"
              name="ETH"
              price="$123,12"
              percentage="-6.21%"
              color="#627EEA"
              onPress={() => router.push("/ethereum")}
            />
          </View>
        </View>

        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Trending 🔥</Text>
            <TouchableOpacity onPress={() => fetchTrendingCoins()}>
              <Text style={{ color: "#00bdb0", fontSize: 14 }}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#00bdb0" />
          ) : error ? (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          ) : (
            trendingCoins.slice(0, 10).map((coin) => (
              <View 
                key={coin.id} 
                style={{ 
                  backgroundColor: "white", 
                  padding: 12, 
                  borderRadius: 10, 
                  marginBottom: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Avatar
                    rounded
                    source={{ uri: coin.image }}
                    size={32}
                    containerStyle={{ marginRight: 8 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{coin.name}</Text>
                    <Text style={{ fontSize: 11, opacity: 0.6 }}>({coin.symbol.toUpperCase()})</Text>
                  </View>
                  <Text style={{ 
                    color: coin.price_change_percentage_24h >= 0 ? '#16bc5a' : '#ef4444',
                    fontSize: 13,
                    fontWeight: "bold"
                  }}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}


