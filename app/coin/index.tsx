import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView, Switch, Modal, TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine
} from "recharts";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, collection, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useAuth } from "../../lib/AuthProvider";

const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";

const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
];

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    ath: {
      usd: number;
    };
    atl: {
      usd: number;
    };
    ath_date: {
      usd: string;
    };
    atl_date: {
      usd: string;
    };
  };
}

interface ChartData {
  time: string;
  date: string;
  price: number;
  timestamp: number;
}

type TimePeriod = '1H' | '1D' | '7D' | '1M' | '1Y' | 'MAX';

export default function CoinPage() {
  const router = useRouter();
  const { id: initialId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [id, setId] = useState(initialId);
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1D');
  const [chartLoading, setChartLoading] = useState(false);
  const [showCoinSelector, setShowCoinSelector] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [userCoins, setUserCoins] = useState<Record<string, number>>({});

  // Theme colors
  const theme = {
    background: isDarkMode ? '#1a1d26' : 'white',
    text: isDarkMode ? '#fff' : '#000',
    subtext: isDarkMode ? '#999' : '#666',
    card: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(26, 29, 38, 0.1)',
    chartLine: '#00f2ab',
    positive: '#00f2ab',
    negative: '#ff6b6b',
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (coinData) {
      fetchChartData();
    }
  }, [timePeriod]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const detailsResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${API_KEY}`
      );
      if (!detailsResponse.ok) throw new Error(`API error: ${detailsResponse.status}`);
      const detailsData = await detailsResponse.json();
      setCoinData(detailsData);
      await fetchChartData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      // Calculate proper intervals and days
      const days = 
        timePeriod === '1H' ? '1' :
        timePeriod === '1D' ? '1' :
        timePeriod === '7D' ? '7' :
        timePeriod === '1M' ? '30' :
        timePeriod === '1Y' ? '365' :
        'max';

      // For 1H, we'll filter the data after fetching
      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${API_KEY}`
      );
      if (!chartResponse.ok) throw new Error(`API error: ${chartResponse.status}`);
      const chartData = await chartResponse.json();
      
      let prices = chartData.prices;
      
      // For 1H, filter last hour's data
      if (timePeriod === '1H') {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        prices = prices.filter((entry: number[]) => entry[0] >= oneHourAgo);
      }

      const formattedData = prices.map((entry: number[]) => {
        const date = new Date(entry[0]);
        return {
          timestamp: entry[0],
          price: parseFloat(entry[1].toFixed(2)), // Ensure price has 2 decimal places
          time: date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false // Use 24-hour format
          }),
          date: date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: timePeriod === 'MAX' ? 'numeric' : undefined
          })
        };
      });

      // Ensure data points are properly spaced
      let filteredData = formattedData;
      if (timePeriod === '1H' || timePeriod === '1D') {
        // Keep more data points for shorter time periods
        filteredData = formattedData;
      } else if (timePeriod === '7D') {
        // Keep every 4th point for 7D
        filteredData = formattedData.filter((_: ChartData, index: number) => index % 4 === 0);
      } else if (timePeriod === '1M') {
        // Keep every 8th point for 1M
        filteredData = formattedData.filter((_: ChartData, index: number) => index % 8 === 0);
      } else if (timePeriod === '1Y') {
        // Keep every 24th point for 1Y
        filteredData = formattedData.filter((_: ChartData, index: number) => index % 24 === 0);
      } else {
        // For MAX, keep enough points to show the trend
        filteredData = formattedData.filter((_: ChartData, index: number) => index % 48 === 0);
      }

      setChartData(filteredData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;
    try {
      // Fetch user balance
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserBalance(userDoc.data().balance || 0);
      }

      // Fetch user coins from coins collection
      const coinsRef = collection(db, "users", user.uid, "coins");
      const coinsSnapshot = await getDocs(coinsRef);
      
      const coins: Record<string, number> = {};
      coinsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        coins[data.symbol?.toUpperCase() || doc.id] = parseFloat(data.quantity) || 0;
      });
      
      setUserCoins(coins);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleTransaction = async () => {
    if (!user || !coinData) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const currentPrice = coinData.market_data.current_price.usd;
    const totalValue = amountNum * currentPrice;

    if (transactionType === 'buy') {
      if (totalValue > userBalance) {
        Alert.alert('Insufficient Balance', 'You do not have enough balance to make this purchase');
        return;
      }
    } else {
      const userCoinAmount = userCoins[coinData.symbol.toUpperCase()] || 0;
      if (amountNum > userCoinAmount) {
        Alert.alert('Insufficient Coins', 'You do not have enough coins to sell');
        return;
      }
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const coinsRef = collection(db, "users", user.uid, "coins");
      const coinDoc = doc(coinsRef, coinData.symbol.toUpperCase());

      if (transactionType === 'buy') {
        // Update user balance
        await updateDoc(userRef, {
          balance: userBalance - totalValue
        });

        // Update or create coin document
        const coinSnapshot = await getDoc(coinDoc);
        if (coinSnapshot.exists()) {
          await updateDoc(coinDoc, {
            quantity: (coinSnapshot.data().quantity || 0) + amountNum
          });
        } else {
          await setDoc(coinDoc, {
            symbol: coinData.symbol.toUpperCase(),
            quantity: amountNum
          });
        }

        // Update local state
        setUserBalance(prev => prev - totalValue);
        setUserCoins(prev => ({
          ...prev,
          [coinData.symbol.toUpperCase()]: (prev[coinData.symbol.toUpperCase()] || 0) + amountNum
        }));
      } else {
        // Update user balance
        await updateDoc(userRef, {
          balance: userBalance + totalValue
        });

        // Update coin document
        const coinSnapshot = await getDoc(coinDoc);
        if (coinSnapshot.exists()) {
          const newQuantity = coinSnapshot.data().quantity - amountNum;
          if (newQuantity <= 0) {
            await deleteDoc(coinDoc);
          } else {
            await updateDoc(coinDoc, {
              quantity: newQuantity
            });
          }
        }

        // Update local state
        setUserBalance(prev => prev + totalValue);
        setUserCoins(prev => ({
          ...prev,
          [coinData.symbol.toUpperCase()]: (prev[coinData.symbol.toUpperCase()] || 0) - amountNum
        }));
      }

      Alert.alert(
        'Success',
        `${transactionType === 'buy' ? 'Bought' : 'Sold'} ${amountNum} ${coinData.symbol.toUpperCase()} for $${totalValue.toFixed(2)}`
      );
      
      setShowTransactionModal(false);
      setAmount('');
      
      // Refresh coin data to get latest price
      fetchInitialData();
    } catch (error) {
      console.error("Error processing transaction:", error);
      Alert.alert('Error', 'Failed to process transaction. Please try again.');
    }
  };

  const formatTooltipDate = (timestamp: number) => {
    if (timePeriod === '1H' || timePeriod === '1D') {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit"
      });
    }
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDynamicScale = (data: ChartData[]) => {
    if (!data.length) return { min: 0, max: 0 };
    
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Dynamic scaling factors based on time period
    const scaleFactor = 
      timePeriod === '1H' ? 0.0001 :
      timePeriod === '1D' ? 0.0005 :
      timePeriod === '7D' ? 0.001 :
      timePeriod === '1M' ? 0.002 :
      0.005; // for 1Y and MAX
    
    return {
      min: minPrice * (1 - scaleFactor),
      max: maxPrice * (1 + scaleFactor)
    };
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.chartLine} />
      </View>
    );
  }

  if (!coinData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Coin not found</Text>
      </View>
    );
  }

  const priceChangeColor = coinData.market_data.price_change_percentage_24h >= 0 ? theme.positive : theme.negative;
  const currentPrice = coinData.market_data.current_price.usd;
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));

  return (
    <ScrollView 
      style={{ 
        flex: 1, 
        backgroundColor: theme.background,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100
      }}
    >
      <View style={{ 
        padding: 16, 
        alignItems: "center",
        paddingBottom: 20,
      }}>
        {/* Header - Simplified */}
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center",
          width: "100%", 
          marginBottom: 16,
          paddingTop: 8
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color={theme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setShowCoinSelector(!showCoinSelector)}
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              backgroundColor: theme.card,
              padding: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.text, marginRight: 8 }}>
              {coinData.symbol.toUpperCase()}
            </Text>
            <MaterialIcons 
              name={showCoinSelector ? "arrow-drop-up" : "arrow-drop-down"} 
              size={24} 
              color={theme.text} 
            />
          </TouchableOpacity>

          <View style={{ width: 24 }} /> {/* Spacer to maintain layout */}
        </View>

        {/* Coin Selector Dropdown */}
        {showCoinSelector && (
          <View style={{
            width: '100%',
            backgroundColor: theme.card,
            borderRadius: 12,
            padding: 8,
            marginBottom: 16,
            position: 'absolute',
            top: 60,
            zIndex: 1000,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            {POPULAR_COINS.map((coin) => (
              <TouchableOpacity
                key={coin.id}
                onPress={() => {
                  setId(coin.id);
                  setShowCoinSelector(false);
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.subtext + '20',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>
                  {coin.name} ({coin.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Price Info */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image 
            source={{ uri: coinData.image.large }} 
            style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 30, fontWeight: "bold", color: theme.text }}>
            ${currentPrice.toLocaleString()}
          </Text>
          <Text style={{ color: priceChangeColor, fontSize: 16 }}>
            {coinData.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
          </Text>
        </View>

        {/* Area Chart */}
        <View style={{ 
          width: "100%",
          height: 300, 
          marginBottom: 20,
          padding: 16,
        }}>
          {chartLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#00f2ab" />
            </View>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ab" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ab" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis 
                  domain={[
                    (dataMin: number) => {
                      const scaleFactor = 
                        timePeriod === '1H' ? 0.9999 :
                        timePeriod === '1D' ? 0.9995 :
                        timePeriod === '7D' ? 0.999 :
                        timePeriod === '1M' ? 0.998 :
                        0.995; // for 1Y and MAX
                      return dataMin * scaleFactor;
                    },
                    (dataMax: number) => {
                      const scaleFactor = 
                        timePeriod === '1H' ? 1.0001 :
                        timePeriod === '1D' ? 1.0005 :
                        timePeriod === '7D' ? 1.001 :
                        timePeriod === '1M' ? 1.002 :
                        1.005; // for 1Y and MAX
                      return dataMax * scaleFactor;
                    }
                  ]}
                  hide={true}
                />
                <Tooltip
                  cursor={{ stroke: theme.subtext, strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: theme.background,
                    borderColor: theme.card,
                  }}
                  content={({ active, payload }) => {
                    if (active && payload?.[0]?.payload) {
                      const data = payload[0].payload;
                      return (
                        <View style={{ 
                          backgroundColor: theme.background,
                          padding: 12,
                          borderRadius: 8,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.15,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}>
                          <Text style={{ 
                            color: theme.chartLine, 
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 4
                          }}>
                            ${data.price.toLocaleString()}
                          </Text>
                          <Text style={{ 
                            color: theme.subtext, 
                            fontSize: 14 
                          }}>
                            {timePeriod === '1H' || timePeriod === '1D' ? data.time : data.date}
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={theme.chartLine}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  isAnimationActive={true}
                  dot={false}
                  activeDot={{ r: 4, fill: theme.chartLine }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </View>

        {/* Time Period Selector */}
        <View style={{ 
          flexDirection: "row", 
          marginBottom: 20, 
          borderRadius: 8, 
          padding: 4,
          backgroundColor: theme.card
        }}>
          {(['1H', '1D', '7D', '1M', '1Y', 'MAX'] as TimePeriod[]).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setTimePeriod(period)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: timePeriod === period ? theme.chartLine : 'transparent',
              }}
            >
              <Text style={{ 
                color: timePeriod === period ? theme.background : theme.subtext,
                fontSize: 14,
                fontWeight: '500'
              }}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Market Stats - Reorganized */}
        <View style={{ 
          width: '100%', 
          marginBottom: 20,
          marginTop: 8
        }}>
          {/* All Time High */}
          <View style={{ 
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16
          }}>
            <Text style={{ color: theme.subtext, fontSize: 14, marginBottom: 8 }}>All Time High</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.positive }}>
              ${coinData.market_data.ath.usd.toLocaleString()}
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>
              {formatDate(coinData.market_data.ath_date.usd)}
            </Text>
          </View>

          {/* All Time Low */}
          <View style={{ 
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16
          }}>
            <Text style={{ color: theme.subtext, fontSize: 14, marginBottom: 8 }}>All Time Low</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.negative }}>
              ${coinData.market_data.atl.usd.toLocaleString()}
            </Text>
            <Text style={{ color: theme.subtext, fontSize: 12 }}>
              {formatDate(coinData.market_data.atl_date.usd)}
            </Text>
          </View>

          {/* Market Cap */}
          <View style={{ 
            backgroundColor: theme.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16
          }}>
            <Text style={{ color: theme.subtext, fontSize: 14, marginBottom: 8 }}>Market Cap</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>
              ${coinData.market_data.market_cap.usd.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Buy & Sell Buttons */}
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-around",
          width: "100%",
          paddingHorizontal: 16,
          position: 'relative',
          zIndex: 1
        }}>
          <TouchableOpacity
            onPress={() => {
              setTransactionType('buy');
              setShowTransactionModal(true);
            }}
            style={{
              backgroundColor: theme.positive,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              flex: 1,
              marginRight: 8,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTransactionType('sell');
              setShowTransactionModal(true);
            }}
            style={{
              backgroundColor: theme.negative,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              flex: 1,
              marginLeft: 8,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Sell</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction Modal */}
      <Modal
        visible={showTransactionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTransactionModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            backgroundColor: theme.background,
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: 400,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: 20,
              textAlign: 'center'
            }}>
              {transactionType === 'buy' ? 'Buy' : 'Sell'} {coinData?.symbol.toUpperCase()}
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.card,
                borderRadius: 8,
                padding: 12,
                color: theme.text,
                marginBottom: 16
              }}
              placeholder="Enter amount"
              placeholderTextColor={theme.subtext}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            {coinData && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: theme.subtext, marginBottom: 8 }}>
                  Current Price: ${coinData.market_data.current_price.usd.toLocaleString()}
                </Text>
                <Text style={{ color: theme.subtext }}>
                  Total Value: ${(parseFloat(amount || '0') * coinData.market_data.current_price.usd).toLocaleString()}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setShowTransactionModal(false)}
                style={{
                  backgroundColor: theme.card,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8
                }}
              >
                <Text style={{ color: theme.text, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTransaction}
                style={{
                  backgroundColor: transactionType === 'buy' ? theme.positive : theme.negative,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                  {transactionType === 'buy' ? 'Buy' : 'Sell'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
