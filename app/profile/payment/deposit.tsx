import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { useAuth } from '../../../lib/AuthProvider';

export default function DepositPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const savedMethods = [
    { id: '1', type: 'Visa', last4: '4242', name: 'Visa card ending in 4242' },
    { id: '2', type: 'Mastercard', last4: '5555', name: 'Mastercard ending in 5555' },
  ];

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // Get current user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const currentBalance = userDoc.data().balance || 0;
      const newBalance = currentBalance + parseFloat(amount);

      // Update user balance
      await updateDoc(doc(db, 'users', user.uid), {
        balance: newBalance,
        lastUpdated: new Date(),
      });

      Alert.alert(
        'Deposit Successful',
        `Amount: $${parseFloat(amount).toFixed(2)}\nNew Balance: $${newBalance.toFixed(2)}\n\nYour funds have been successfully added to your account.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 16,
    },
    amountInput: {
      backgroundColor: colors.card,
      marginBottom: 24,
      fontSize: 24,
    },
    methodsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    methodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    methodItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    methodText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    depositButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    depositButtonDisabled: {
      opacity: 0.6,
    },
    depositButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Deposit Funds</Text>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          label="Amount to Deposit"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={styles.amountInput}
          disabled={loading}
          left={<TextInput.Affix text="$" />}
        />

        <Text style={styles.methodsTitle}>Select Payment Method</Text>
        {savedMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodItem,
              selectedMethod === method.id && styles.methodItemSelected,
            ]}
            onPress={() => setSelectedMethod(method.id)}
            disabled={loading}
          >
            <MaterialIcons
              name={method.type.toLowerCase() === 'visa' ? 'credit-card' : 'credit-card'}
              size={24}
              color={colors.text}
            />
            <Text style={styles.methodText}>{method.name}</Text>
            {selectedMethod === method.id && (
              <MaterialIcons name="check-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.depositButton,
            (loading || !amount || !selectedMethod) && styles.depositButtonDisabled,
          ]}
          onPress={handleDeposit}
          disabled={loading || !amount || !selectedMethod}
        >
          <Text style={styles.depositButtonText}>
            {loading ? 'Processing...' : 'Deposit Funds'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 