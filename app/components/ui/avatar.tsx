import { View, Image, Text } from "react-native";

interface AvatarProps {
  source?: string;
  size?: number;
}

export function Avatar({ source, size = 40 }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontSize: size / 2.5, fontWeight: "bold", color: "#555" }}>U</Text>
      )}
    </View>
  );
}
