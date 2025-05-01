import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../lib/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReferralPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const referralLink = `https://yourapp.com/referral?code=${user?.uid || 'demo'}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on this app! Use my referral link: ${referralLink}`,
      });
    } catch (error) {
      // handle error
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.text }]}>Invite a Friend</Text>
        <Text style={[styles.label, { color: colors.text }]}>Your Referral Link:</Text>
        <View style={[styles.linkBox, { backgroundColor: colors.card, shadowColor: colors.primary }]}> 
          <Text selectable style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>{referralLink}</Text>
        </View>
        <TouchableOpacity style={[styles.shareButton, { backgroundColor: colors.primary }]} onPress={handleShare}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Share Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 0.5 },
  label: { fontSize: 18, marginBottom: 12, opacity: 0.8 },
  linkBox: { padding: 18, borderRadius: 14, marginBottom: 32, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  shareButton: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12, marginTop: 8, shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
}); 