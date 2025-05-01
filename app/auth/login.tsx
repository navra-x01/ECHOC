import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig"; // Ensure this path is correct
import { Eye, EyeOff } from "lucide-react-native";
import Logo from "../../app/components/Logo";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset",
        "If an account exists with this email, you will receive a password reset link shortly. Please check your email inbox and spam folder."
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholder="Enter your email"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholder="Enter your password"
          editable={!isLoading}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={styles.eyeIcon}
          disabled={isLoading}
        >
          {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={handleForgotPassword}
        disabled={isLoading}
      > 
        <Text style={[styles.forgotPassword, isLoading && styles.disabledText]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.registerText}>
        Don't have an account? 
        <Text 
          style={[styles.registerLink, isLoading && styles.disabledText]} 
          onPress={() => !isLoading && router.push("../auth/signup")}
        >
          {" "}Sign Up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  forgotPassword: {
    color: "#ff9800",
    textAlign: "right",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  disabledText: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
  },
  registerLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});


