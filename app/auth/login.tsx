


// import { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { login } from "../../lib/auth";
// import { Eye, EyeOff } from "lucide-react-native";

// export default function LoginScreen() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//       router.replace("/");
//       Alert.alert("Success", "Logged in successfully!");
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//       />
      
//       <Text style={styles.label}>Password</Text>
//       <View style={styles.passwordContainer}>
//         <TextInput
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={!showPassword}
//           style={styles.input}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
//           {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
//         </TouchableOpacity>
//       </View>
      
//       <TouchableOpacity onPress={() => Alert.alert("Forgot Password?", "Reset link sent.")}> 
//         <Text style={styles.forgotPassword}>Forgot Password?</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
      
//       <Text style={styles.registerText}>
//         Don't have an account? 
//         <Text style={styles.registerLink} onPress={() => router.push("../auth/signup")}>
//           Sign Up
//         </Text>
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//     width: "100%",
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: "relative",
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 10,
//   },
//   forgotPassword: {
//     color: "#ff9800",
//     textAlign: "right",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   registerText: {
//     marginTop: 15,
//     textAlign: "center",
//     fontSize: 16,
//   },
//   registerLink: {
//     color: "#007bff",
//     fontWeight: "bold",
//   },
// });


import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig"; // Ensure this path is correct
import { Eye, EyeOff } from "lucide-react-native";
import Logo from "../../app/components/Logo";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error", errorMessage);
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
      />
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholder="Enter your password"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => Alert.alert("Forgot Password?", "Reset link sent.")}> 
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.registerText}>
        Don't have an account? 
        <Text style={styles.registerLink} onPress={() => router.push("../auth/signup")}>
          Sign Up
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
    width: 100,
    height: 100,
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


