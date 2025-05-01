import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "../../lib/AuthProvider";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserData {
  name: string;
  balance: number;
  avatar?: string;
}

export default function ProfilePage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    balance: 0,
    avatar: '',
  });

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
          avatar: userDoc.data().avatar,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    profileCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatarContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 16,
      overflow: 'hidden',
      backgroundColor: colors.border,
    },
    avatar: {
      width: "100%",
      height: "100%",
    },
    userInfoContainer: {
      flex: 1,
    },
    userName: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    editButton: {
      padding: 8,
    },
    balanceContainer: {
      marginTop: 24,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    balanceLabel: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 8,
    },
    settingsContainer: {
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
    },
    settingsHeader: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      padding: 12,
      backgroundColor: colors.card,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: colors.card,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
    },
    settingIcon: {
      width: 20,
      alignItems: 'center',
      marginRight: 8,
    },
    settingText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
  });

  const settingsItems = [
    {
      icon: <Feather name="clock" size={18} color={colors.text} />,
      text: "Transaction History",
      route: "/profile/transaction-list"
    },
    {
      icon: <MaterialIcons name="account-balance-wallet" size={18} color={colors.text} />,
      text: "Funds",
      route: "/profile/payment"
    },
    {
      icon: <Ionicons name="notifications-outline" size={18} color={colors.text} />,
      text: "Notifications",
      route: "/profile/notifications"
    },
    {
      icon: <Feather name="user-plus" size={18} color={colors.text} />,
      text: "Referral Program / Invite Friend",
      route: "/profile/referral"
    },
    {
      icon: <Feather name="help-circle" size={18} color={colors.text} />,
      text: "Help / FAQ",
      route: "/profile/help"
    },
    {
      icon: <MaterialIcons name="support-agent" size={18} color={colors.text} />,
      text: "Contact Support",
      route: "/profile/support"
    },
    {
      icon: <Feather name="file-text" size={18} color={colors.text} />,
      text: "Terms of Service & Privacy Policy",
      route: "/profile/privacy"
    },
    {
      icon: <Feather name="message-square" size={18} color={colors.text} />,
      text: "Report a Problem / Feedback",
      route: "/profile/feedback"
    },
    {
      icon: <Feather name="log-out" size={18} color="#FF3B30" />,
      text: "Log Out",
      route: "/auth/logout",
      textColor: "#FF3B30"
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {userData?.avatar ? (
                <Image source={{ uri: userData.avatar }} style={styles.avatar} />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <MaterialIcons name="person" size={35} color={colors.text} />
                </View>
              )}
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{userData?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/profile/edit')}
            >
              <MaterialIcons name="edit" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Text style={styles.balanceAmount}>
                {showBalance ? `$${userData.balance.toFixed(2)}` : "••••••"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsHeader}>Account Settings</Text>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => router.push(item.route)}
              style={styles.settingItem}
            >
              <View style={styles.settingIcon}>
                {item.icon}
              </View>
              <Text style={[
                styles.settingText,
                item.textColor ? { color: item.textColor } : null
              ]}>
                {item.text}
              </Text>
              <MaterialIcons 
                name="chevron-right" 
                size={16} 
                color={item.textColor || colors.text} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
