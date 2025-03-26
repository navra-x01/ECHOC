import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import CryptoCard from "../app/components/CryptoCard";
import CoinCard from "../app/components/CoinCard";
import TrendingCard from "../app/components/TrendingCard";
import ProtectedRoute from "../app/components/ProtectedRoute"; // ✅ Import Protected Route

export default function HomePage() {
  const router = useRouter();

  return (
    <ProtectedRoute> {/* ✅ Wrap Home Page */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
          Trade Now and Get{"\n"}Your Life
        </Text>

        {/* Total Crypto Balance */}
        <CryptoCard total="$7,273,291" profit="$193,28" percentage="2.41%" />

        {/* My Coins Section */}
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

        {/* Trending Section */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Trending 🔥</Text>
            <TouchableOpacity>
              <Text style={{ color: "#00bdb0", fontSize: 14 }}>See all</Text>
            </TouchableOpacity>
          </View>

          <TrendingCard symbol="₿" name="BTC" priceChange="12.21%" color="#F7931A" />
        </View>
      </ScrollView>
    </ProtectedRoute>
  );
}
