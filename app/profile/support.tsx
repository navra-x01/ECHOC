import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportPage() {
  const { colors } = useTheme();
  const supportEmail = 'gaurangsarang01@gmail.com';

  const handleEmail = () => {
    Linking.openURL(`mailto:${supportEmail}?subject=Support Request`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.text }]}>Contact Support</Text>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
          <Text style={[styles.label, { color: colors.text }]}>Email us at:</Text>
          <Text selectable style={[styles.email, { color: colors.primary }]}>{supportEmail}</Text>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleEmail}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Email Support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 0.5 },
  card: { borderRadius: 14, padding: 20, marginBottom: 32, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3, alignItems: 'center' },
  label: { fontSize: 18, marginBottom: 8, opacity: 0.8 },
  email: { fontSize: 16, marginBottom: 0, fontWeight: 'bold' },
  button: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12, marginTop: 8, shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
}); 