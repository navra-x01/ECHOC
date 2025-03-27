import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "../../lib/AuthProvider";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Header from "../components/Header";

export default function ProfilePage() {
  const { colors, dark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState({ name: "", balance: 0 });

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
        setUserData({
          name: userDoc.data().name || "User",
          balance: userDoc.data().balance || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header 
        title="Profile"
        rightComponent={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name={dark ? "sunny" : "moon"} size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: colors.card,
          marginHorizontal: 20,
          padding: 20,
          borderRadius: 10,
          marginTop: 20,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: "https://via.placeholder.com/80" }}
            style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.border }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>{userData.name}</Text>
            <Text style={{ fontSize: 14, color: colors.text }}>Premium User Since 2021</Text>
          </View>
        </View>

        {/* Balance */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, color: colors.text }}>Current Balance</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 5, color: colors.text }}>
              {showBalance ? `$${userData.balance.toFixed(2)}` : "••••••"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
          <TouchableOpacity style={{ backgroundColor: "#33d587", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#3443cf", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Deposit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>Quick Actions</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <TouchableOpacity onPress={() => router.push("../../app/profile/transaction-list")}>
            <Feather name="clock" size={24} color={colors.text} />
            <Text style={{ color: colors.text }}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../../app/wallet")}>
            <Feather name="trending-up" size={24} color={colors.text} />
            <Text style={{ color: colors.text }}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../../app/search")}>
            <Feather name="credit-card" size={24} color={colors.text} />
            <Text style={{ color: colors.text }}>Assets</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../../app/profile")}>
            <Feather name="settings" size={24} color={colors.text} />
            <Text style={{ color: colors.text }}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Settings */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>Account Settings</Text>
        <TouchableOpacity onPress={() => router.push("../../app/profile/privacy")} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <MaterialIcons name="lock" size={24} color={colors.text} />
          <Text style={{ marginLeft: 10, color: colors.text }}>Privacy & Security</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("../../app/profile/payment")} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <MaterialIcons name="payment" size={24} color={colors.text} />
          <Text style={{ marginLeft: 10, color: colors.text }}>Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("../../app/profile/notifications")} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <Text style={{ marginLeft: 10, color: colors.text }}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/logout")} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Feather name="log-out" size={24} color={colors.text} />
          <Text style={{ marginLeft: 10, color: colors.text }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
