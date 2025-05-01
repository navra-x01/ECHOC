import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPage() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Terms of Service & Privacy Policy</Text>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Terms of Service</Text>
          <Text style={[styles.text, { color: colors.text }]}>Welcome to our app! By using this application, you agree to the following terms and conditions. Please read them carefully before using our services.</Text>
          <Text style={[styles.text, { color: colors.text }]}>1. <Text style={styles.bold}>Acceptance of Terms:</Text> By accessing or using our app, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use the app.</Text>
          <Text style={[styles.text, { color: colors.text }]}>2. <Text style={styles.bold}>Account Registration:</Text> You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account and password.</Text>
          <Text style={[styles.text, { color: colors.text }]}>3. <Text style={styles.bold}>User Conduct:</Text> You agree not to use the app for any unlawful or prohibited activities, including but not limited to fraud, money laundering, or violating intellectual property rights.</Text>
          <Text style={[styles.text, { color: colors.text }]}>4. <Text style={styles.bold}>Transactions:</Text> All cryptocurrency transactions are final and irreversible. We are not responsible for any losses due to market fluctuations or user error.</Text>
          <Text style={[styles.text, { color: colors.text }]}>5. <Text style={styles.bold}>Fees:</Text> Certain transactions may incur fees, which will be disclosed prior to confirmation. You are responsible for all applicable fees and taxes.</Text>
          <Text style={[styles.text, { color: colors.text }]}>6. <Text style={styles.bold}>Termination:</Text> We reserve the right to suspend or terminate your account at any time for violations of these terms or suspicious activity.</Text>
          <Text style={[styles.text, { color: colors.text }]}>7. <Text style={styles.bold}>Limitation of Liability:</Text> We are not liable for any indirect, incidental, or consequential damages arising from your use of the app.</Text>
          <Text style={[styles.text, { color: colors.text }]}>8. <Text style={styles.bold}>Changes to Terms:</Text> We may update these terms at any time. Continued use of the app constitutes acceptance of the new terms.</Text>
          <Text style={[styles.text, { color: colors.text }]}>9. <Text style={styles.bold}>Governing Law:</Text> These terms are governed by the laws of your jurisdiction.</Text>
          <Text style={[styles.text, { color: colors.text }]}>10. <Text style={styles.bold}>Contact:</Text> For questions about these terms, contact support from the Profile page.</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Privacy Policy</Text>
          <Text style={[styles.text, { color: colors.text }]}>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</Text>
          <Text style={[styles.text, { color: colors.text }]}>1. <Text style={styles.bold}>Information We Collect:</Text> We collect information you provide when you register, such as your name, email, and transaction history. We may also collect device and usage data.</Text>
          <Text style={[styles.text, { color: colors.text }]}>2. <Text style={styles.bold}>How We Use Information:</Text> We use your information to provide and improve our services, process transactions, and communicate with you.</Text>
          <Text style={[styles.text, { color: colors.text }]}>3. <Text style={styles.bold}>Cookies & Tracking:</Text> We may use cookies and similar technologies to enhance your experience and analyze usage.</Text>
          <Text style={[styles.text, { color: colors.text }]}>4. <Text style={styles.bold}>Data Sharing:</Text> We do not sell your personal information. We may share data with service providers or as required by law.</Text>
          <Text style={[styles.text, { color: colors.text }]}>5. <Text style={styles.bold}>Data Security:</Text> We implement industry-standard security measures to protect your data, but cannot guarantee absolute security.</Text>
          <Text style={[styles.text, { color: colors.text }]}>6. <Text style={styles.bold}>Your Choices:</Text> You may update or delete your account information at any time. You can opt out of marketing communications.</Text>
          <Text style={[styles.text, { color: colors.text }]}>7. <Text style={styles.bold}>Children's Privacy:</Text> Our app is not intended for children under 18. We do not knowingly collect data from minors.</Text>
          <Text style={[styles.text, { color: colors.text }]}>8. <Text style={styles.bold}>International Users:</Text> Your data may be processed in countries outside your own. By using the app, you consent to such transfers.</Text>
          <Text style={[styles.text, { color: colors.text }]}>9. <Text style={styles.bold}>Policy Updates:</Text> We may update this policy. Changes will be posted in the app.</Text>
          <Text style={[styles.text, { color: colors.text }]}>10. <Text style={styles.bold}>Contact:</Text> For privacy questions, contact support from the Profile page.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 0.5, textAlign: 'center' },
  card: { borderRadius: 14, padding: 20, marginBottom: 24, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  text: { fontSize: 16, marginBottom: 8, opacity: 0.9 },
  bold: { fontWeight: 'bold' },
}); 