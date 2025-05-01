import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpPage() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Help / FAQ</Text>
        <View style={styles.faqBox}>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>How do I buy or sell coins?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Go to the coin page, select Buy or Sell, enter the amount, and confirm your transaction.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>How do I withdraw funds?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Go to Profile {'>'} Funds and follow the withdrawal instructions.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>Is my data secure?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Yes, we use industry-standard security practices to protect your data.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>Need more help?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Contact support from the Profile page.</Text>
          </View>

          {/* Additional FAQ entries */}
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>How do I reset my password?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Go to Profile {'>'} Edit Profile and select 'Change Password'. Follow the instructions sent to your email.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>Can I change my email address?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Currently, you cannot change your email address directly. Please contact support for assistance.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>What should I do if I suspect unauthorized activity?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Immediately change your password and contact support. We recommend enabling two-factor authentication for added security.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>How do I enable two-factor authentication (2FA)?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Go to Profile {'>'} Security Settings and follow the instructions to enable 2FA.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>Are there any fees for buying or selling?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Yes, a small platform and network fee is applied to each transaction. You can view the fee breakdown before confirming.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>How do I view my transaction history?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Go to Profile {'>'} Transaction History to see all your past transactions.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>How do I contact support?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Go to Profile {'>'} Contact Support and send us an email. We aim to respond within 24 hours.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>Can I delete my account?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Yes, please contact support to request account deletion. Note that this action is irreversible.</Text>
          </View>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
            <Text style={[styles.question, { color: colors.primary }]}>Where can I learn more about cryptocurrency?</Text>
            <Text style={[styles.answer, { color: colors.text }]}>Visit the Learn section in the app for tutorials, articles, and courses on crypto basics and trading.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 0.5, textAlign: 'center' },
  faqBox: { gap: 18 },
  card: { borderRadius: 14, padding: 20, marginBottom: 0, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  question: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  answer: { fontSize: 16, opacity: 0.9 },
}); 