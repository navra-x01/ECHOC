import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useAuth } from "../../lib/AuthProvider";

const API_KEY = "CG-RA1kcuTZoEQ3F5LeE6iMQTFB";
const API_URL = `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1&interval=daily&x_cg_demo_api_key=${API_KEY}`;

export default function EthereumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ethAmount, setEthAmount] = useState(""); 
  const [transactionType, setTransactionType] = useState<"buy" | "sell" | null>(null); 

  useEffect(() => {
    fetchCryptoData();
    fetchBalance();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      if (!data.prices) throw new Error("Invalid API response");

      setEthPrice(data.prices[data.prices.length - 1][1]); // Latest ETH price
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setBalance(userDoc.data().balance || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleTransaction = async () => {
    if (!user || ethAmount.trim() === "") return;
    const ethToProcess = parseFloat(ethAmount);
    if (isNaN(ethToProcess) || ethToProcess <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid ETH amount.");
      return;
    }

    const totalValue = ethToProcess * ethPrice;
    let newBalance = balance;

    if (transactionType === "buy") {
      if (balance < totalValue) {
        Alert.alert("Insufficient funds", "You don't have enough balance to buy this amount of Ethereum.");
        return;
      }
      newBalance -= totalValue;
    } else if (transactionType === "sell") {
      newBalance += totalValue;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { balance: newBalance });

      Alert.alert(
        `${transactionType === "buy" ? "Purchase" : "Sell"} Successful`,
        `You ${transactionType === "buy" ? "bought" : "sold"} ${ethToProcess} ETH for $${totalValue.toFixed(2)}.`
      );
      setBalance(newBalance);
      setModalVisible(false);
      setEthAmount(""); // Reset input
    } catch (error) {
      console.error(`Error ${transactionType}ing Ethereum:`, error);
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
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>${ethPrice.toFixed(2)}</Text>
        <Text style={{ fontSize: 16 }}>Balance: ${balance.toFixed(2)}</Text>
      </View>

      {/* Buy & Sell Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
        <TouchableOpacity
          onPress={() => {
            setTransactionType("sell");
            setModalVisible(true);
          }}
          style={{ flex: 1, backgroundColor: "red", padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTransactionType("buy");
            setModalVisible(true);
          }}
          style={{ flex: 1, backgroundColor: "green", padding: 15, alignItems: "center", borderRadius: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Buy</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              {transactionType === "buy" ? "Buy Ethereum" : "Sell Ethereum"}
            </Text>
            
            <TextInput
              style={{
                width: "100%",
                height: 50,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                paddingHorizontal: 15,
                marginBottom: 10,
                fontSize: 16,
              }}
              keyboardType="numeric"
              placeholder="Enter ETH amount"
              value={ethAmount}
              onChangeText={setEthAmount}
            />

            {/* Calculated Value */}
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              Total: <Text style={{ fontWeight: "bold" }}>${(parseFloat(ethAmount) * ethPrice || 0).toFixed(2)}</Text>
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, backgroundColor: "#ccc", padding: 12, alignItems: "center", borderRadius: 10, marginRight: 10 }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTransaction} style={{ flex: 1, backgroundColor: transactionType === "buy" ? "green" : "red", padding: 12, alignItems: "center", borderRadius: 10 }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>{transactionType === "buy" ? "Confirm Buy" : "Confirm Sell"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

