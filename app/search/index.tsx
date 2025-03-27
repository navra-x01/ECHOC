import React from "react";
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useAuth } from "../../lib/AuthProvider";
import SearchPageModified from "../../app/search/modified";
import { Avatar } from "react-native-elements";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";

export default function SearchPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [recentCoins, setRecentCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("User");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAllCoins, setShowAllCoins] = useState(false);
  const [viewMode, setViewMode] = useState<'recent' | 'favorites'>('recent');

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchUserData();
      }
    }, [user])
  );

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setBalance(data.balance || 0);
        setUserName(data.name || "User");
        setFavorites(data.favorites || []);
        
        // Fetch recently visited coins from user data
        const recentCoinIds = data.recentlyVisited || [];
        if (recentCoinIds.length > 0) {
          await fetchRecentCoins(recentCoinIds);
        } else {
          setRecentCoins([]);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRecentCoins = async (coinIds: string[]) => {
    try {
      setLoading(true);
      setError(null);

      // Create the CoinGecko API URL with all coin IDs
      const idsParam = coinIds.join(',');
      const COINGECKO_API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=false&x_cg_demo_api_key=${API_KEY}`;

      const response = await fetch(COINGECKO_API);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }
      
      const data = await response.json();
      // Sort the data to match the order of coinIds (most recent first)
      const sortedData = coinIds
        .map(id => data.find((coin: Coin) => coin.id === id))
        .filter((coin): coin is Coin => coin !== undefined);
      setRecentCoins(sortedData);
    } catch (error) {
      console.error("Error fetching recent coins:", error);
      setError('Failed to load cryptocurrency data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (coinId: string) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    try {
      if (favorites.includes(coinId)) {
        await updateDoc(userRef, { favorites: arrayRemove(coinId) });
        setFavorites(favorites.filter(id => id !== coinId));
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(coinId) });
        setFavorites([...favorites, coinId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const displayedCoins = viewMode === 'recent' 
    ? recentCoins 
    : recentCoins.filter(coin => favorites.includes(coin.id));

  if (isSearchActive) {
    return <SearchPageModified onClose={() => {
      setIsSearchActive(false);
      fetchUserData();
    }} initialQuery={searchQuery} />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => router.push("../../app/assets")}> 
          <Ionicons name="chevron-back" size={24} color={colors.text} /> 
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "500", color: colors.text }}>Discover</Text>
        <TouchableOpacity>
          <Feather name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ 
          padding: 16, 
          paddingBottom: displayedCoins.length > 5 ? 120 : 40
        }} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: colors.text }}>Welcome, {userName}</Text>
        <Text style={{ fontSize: 14, color: colors.text }}>Total Balance</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>${balance.toFixed(2)}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity 
            style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 8, padding: 10, flex: 1 }}
            onPress={() => setIsSearchActive(true)}
          >
            <Feather name="search" size={20} color={colors.text} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search cryptocurrencies"
              placeholderTextColor={colors.text}
              style={{ flex: 1, fontSize: 14, color: colors.text }}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        <View style={{ 
          flexDirection: "row", 
          marginBottom: 16,
          backgroundColor: colors.card,
          borderRadius: 8,
          padding: 4
        }}>
          <TouchableOpacity 
            style={{ 
              flex: 1,
              backgroundColor: viewMode === 'recent' ? colors.primary : 'transparent',
              padding: 8,
              borderRadius: 6,
              alignItems: 'center'
            }}
            onPress={() => setViewMode('recent')}
          >
            <Text style={{ 
              color: viewMode === 'recent' ? 'white' : colors.text,
              fontWeight: viewMode === 'recent' ? 'bold' : 'normal'
            }}>
              Recently Viewed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              flex: 1,
              backgroundColor: viewMode === 'favorites' ? colors.primary : 'transparent',
              padding: 8,
              borderRadius: 6,
              alignItems: 'center'
            }}
            onPress={() => setViewMode('favorites')}
          >
            <Text style={{ 
              color: viewMode === 'favorites' ? 'white' : colors.text,
              fontWeight: viewMode === 'favorites' ? 'bold' : 'normal'
            }}>
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={{ flex: 1 }}>
          {displayedCoins.length === 0 ? (
            <View style={{ padding: 16, alignItems: "center" }}>
              <Text style={{ color: colors.text, opacity: 0.7 }}>
                {viewMode === 'recent' ? 'No recently viewed coins' : 'No favorite coins'}
              </Text>
            </View>
          ) : (
            <>
              {displayedCoins.map((coin) => (
                <TouchableOpacity
                  key={coin.id}
                  onPress={() => router.push(`/coin?id=${coin.id}`)}
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
                    <View style={{ alignItems: "flex-end" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold", marginRight: 10 }}>
                          ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                        <TouchableOpacity onPress={() => toggleFavorite(coin.id)}>
                          <AntDesign 
                            name={favorites.includes(coin.id) ? "heart" : "hearto"} 
                            size={20} 
                            color={favorites.includes(coin.id) ? "#ef4444" : colors.text} 
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={{ 
                        color: coin.price_change_percentage_24h >= 0 ? '#16bc5a' : '#ef4444',
                        fontSize: 14 
                      }}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
}