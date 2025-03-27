import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        // Clear any local storage or state if needed
        router.replace("/auth/login");
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, we should still try to redirect to login
        router.replace("/auth/login");
      }
    };

    handleLogout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#00bdb0" />
    </View>
  );
}
