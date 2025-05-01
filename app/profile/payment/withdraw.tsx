import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { useAuth } from '../../../lib/AuthProvider';

export default function WithdrawPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBalance();
    }
  }, [user]);

  const fetchUserBalance = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setCurrentBalance(userDoc.data().balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const savedMethods = [
    { id: '1', type: 'Bank', name: 'HDFC Bank ****1234' },
    { id: '2', type: 'Bank', name: 'SBI Bank ****5678' },
  ];

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a withdrawal method');
      return;
    }

    setLoading(true);
    try {
      // Get current user data
      const userDoc = await getDoc(doc(db, 'users', user?.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const newBalance = currentBalance - parseFloat(amount);

      // Update user balance
      await updateDoc(doc(db, 'users', user?.uid), {
        balance: newBalance,
        lastUpdated: new Date(),
      });

      Alert.alert(
        'Withdrawal Successful',
        `Amount Withdrawn: $${parseFloat(amount).toFixed(2)}\nRemaining Balance: $${newBalance.toFixed(2)}\n\nYour withdrawal has been initiated and will be processed shortly.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
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
    balanceCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 24,
    },
    balanceTitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    balanceAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 4,
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
    withdrawButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    withdrawButtonDisabled: {
      opacity: 0.6,
    },
    withdrawButtonText: {
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
        <Text style={styles.title}>Withdraw Funds</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
        </View>

        <TextInput
          label="Amount to Withdraw"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={styles.amountInput}
          disabled={loading}
          left={<TextInput.Affix text="$" />}
        />

        <Text style={styles.methodsTitle}>Select Withdrawal Method</Text>
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
              name="account-balance"
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
            styles.withdrawButton,
            (loading || !amount || !selectedMethod || parseFloat(amount) > currentBalance) && 
            styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          disabled={loading || !amount || !selectedMethod || parseFloat(amount) > currentBalance}
        >
          <Text style={styles.withdrawButtonText}>
            {loading ? 'Processing...' : 'Withdraw Funds'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 