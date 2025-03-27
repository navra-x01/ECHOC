import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { db } from "../../../lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../lib/AuthProvider";
import { useRouter, useFocusEffect } from "expo-router";
import React from "react";

interface SearchPageModifiedProps {
  initialQuery?: string;
  onClose: () => void;
}

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";
const COINGECKO_API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${API_KEY}`;

export default function SearchPageModified({ initialQuery = "", onClose }: SearchPageModifiedProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [balance, setBalance] = useState("$0.00");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'recent' | 'favorite'>('recent');

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchBalance();
        fetchCoins();
      }
    }, [user])
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter(
        coin =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
  }, [searchQuery, coins]);

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setBalance(userDoc.data().balance ? `$${userDoc.data().balance.toFixed(2)}` : "$0.00");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(COINGECKO_API);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }
      
      const data = await response.json();
      setCoins(data);
      setFilteredCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
      setError('Failed to load cryptocurrency data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCoinClick = async (coin: Coin) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentVisited = userDoc.data().recentlyVisited || [];
        
        // Remove the coin if it already exists (to avoid duplicates)
        const updatedVisited = currentVisited.filter((id: string) => id !== coin.id);
        
        // Add the coin to the beginning of the array (most recent first)
        updatedVisited.unshift(coin.id);
        
        // Keep only the last 20 visited coins
        const limitedVisited = updatedVisited.slice(0, 20);
        
        await updateDoc(userRef, {
          recentlyVisited: limitedVisited
        });
      }
    } catch (error) {
      console.error("Error updating recently visited coins:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 }}>
        <Text style={{ color: colors.text, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity 
          onPress={fetchCoins}
          style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity onPress={onClose} style={{ marginRight: 10 }}>
          <AntDesign name="arrowleft" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.card, padding: 10, borderRadius: 10 }}>
          <Feather name="search" size={20} color={colors.text} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search cryptocurrencies"
            placeholderTextColor={colors.text}
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ flex: 1, color: colors.text }}
            autoFocus
          />
        </View>
      </View>
      
      {/* Total Balance */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 14, opacity: 0.7 }}>Total Balance</Text>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold" }}>{balance}</Text>
      </View>
      
      {/* Coins List */}
      <ScrollView style={{ flex: 1 }}>
        {filteredCoins.length === 0 ? (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: colors.text, opacity: 0.7 }}>
              {viewMode === 'recent' ? 'No recently viewed coins' : 'No favorite coins'}
            </Text>
          </View>
        ) : (
          <>
            {filteredCoins.map((coin) => (
              <TouchableOpacity
                key={coin.id}
                onPress={async () => {
                  await handleCoinClick(coin);
                  router.push(`/coin?id=${coin.id}`);
                }}
                style={{ 
                  backgroundColor: colors.card, 
                  padding: 16, 
                  borderRadius: 10, 
                  marginBottom: 10,
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
                    size={40}
                    containerStyle={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}>{coin.name}</Text>
                    <Text style={{ color: colors.text, fontSize: 12, opacity: 0.6 }}>({coin.symbol.toUpperCase()})</Text>
                  </View>
                  <Text style={{ 
                    color: coin.price_change_percentage_24h >= 0 ? '#16bc5a' : '#ef4444',
                    fontSize: 14 
                  }}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </Text>
                </View>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold", marginTop: 5 }}>
                  ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 16, borderTopWidth: 1, borderColor: colors.border }}>
        {["Watchlist", "News", "Movers", "Rewards"].map((tab, index) => (
          <TouchableOpacity key={index}>
            <Text style={{ color: colors.text, fontSize: 14 }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
