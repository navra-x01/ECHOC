import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";


const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";
const API_URL = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1&interval=daily&x_cg_demo_api_key=${API_KEY}`;

export default function EthereumPage() {
  const router = useRouter();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      if (!data.prices) throw new Error("Invalid API response");

      const formattedData = data.prices.map((entry: number[]) => ({
        time: new Date(entry[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: entry[1],
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, alignItems: "center" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <AntDesign name="left" size={24} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Ethereum</Text>
        <TouchableOpacity>
          <Feather name="heart" size={24} />
        </TouchableOpacity>
      </View>

      {/* Price Info */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View style={{ width: 64, height: 64, backgroundColor: "#627EEA", borderRadius: 32, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Ξ</Text>
        </View>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>${chartData.length ? chartData[chartData.length - 1].price.toFixed(2) : "..."}</Text>
      </View>

      {/* Area Chart */}
      <View style={{ width: "100%", height: 250, marginBottom: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#627EEA" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#627EEA" fill="#627EEA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </View>

      {/* Buy & Sell Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "red", padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "green", padding: 15, alignItems: "center", borderRadius: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
