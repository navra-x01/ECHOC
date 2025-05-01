import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function AssetsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "500", color: colors.text, marginBottom: 8 }}>All Transactions</Text>
      <TouchableOpacity onPress={() => router.push("/profile/transaction-list")}>
        <Text style={{ fontSize: 14, color: colors.primary }}>View all</Text>
      </TouchableOpacity>
    </View>
  );
} 