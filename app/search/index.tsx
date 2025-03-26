import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import SearchPageModified from "../../app/search/modified";

export default function SearchPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (isSearchActive) {
    return <SearchPageModified onClose={() => setIsSearchActive(false)} initialQuery={searchQuery} />;
  }

  return (
    <View style={{ flex: 1, paddingBottom: 16, backgroundColor: colors.background }}>
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => router.push("../../app/assets")}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "500", color: colors.text }}>Total Assets</Text>
        <Image source={{ uri: "/placeholder.svg" }} style={{ width: 32, height: 32, borderRadius: 16 }} />
        <TouchableOpacity>
          <Feather name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: colors.text }}>Welcome, Dianne Ameter</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity 
            style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 8, padding: 10, flex: 1 }}
            onPress={() => setIsSearchActive(true)}
          >
            <Feather name="search" size={20} color={colors.text} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={colors.text}
              style={{ flex: 1, fontSize: 14, color: colors.text }}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 8, padding: 10, backgroundColor: colors.primary, borderRadius: 8 }}>
            <Feather name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
          <TouchableOpacity style={{ padding: 10, backgroundColor: colors.primary, borderRadius: 20 }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>All charts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, backgroundColor: colors.card, borderRadius: 20 }}>
            <Text style={{ color: colors.text }}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10, backgroundColor: colors.card, borderRadius: 20 }}>
            <Text style={{ color: colors.text }}>Top rising</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: colors.text }}>Total Balance</Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}>$83,432.43</Text>
        </View>

        <View style={{ padding: 16, backgroundColor: colors.card, borderRadius: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>Ethereum</Text>
            <Text style={{ marginLeft: 8, fontSize: 12, color: "#16bc5a" }}>▲ 6.4%</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>$2,342.90</Text>
        </View>

        <View style={{ padding: 16, backgroundColor: colors.card, borderRadius: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>Bitcoin</Text>
            <Text style={{ marginLeft: 8, fontSize: 12, color: "#f26666" }}>▼ 3.9%</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>$36,106.36</Text>
        </View>
      </ScrollView>
    </View>
  );
}
