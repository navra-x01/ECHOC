import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TextInput, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  expiryDate?: string;
  upiId?: string;
  bankName?: string;
  cardType?: string;
}

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface CardTypeInfo {
  name: string;
  icon: MaterialIconName;
  color: string;
  pattern: RegExp;
}

const CARD_TYPES: Record<CardType, CardTypeInfo> = {
  visa: {
    name: 'Visa',
    icon: 'credit-card',
    color: '#1A1F71',
    pattern: /^4/,
  },
  mastercard: {
    name: 'Mastercard',
    icon: 'credit-card',
    color: '#EB001B',
    pattern: /^5[1-5]/,
  },
  amex: {
    name: 'American Express',
    icon: 'credit-card',
    color: '#2E77BC',
    pattern: /^3[47]/,
  },
  discover: {
    name: 'Discover',
    icon: 'credit-card',
    color: '#FF6000',
    pattern: /^6(?:011|5)/,
  },
  unknown: {
    name: 'Card',
    icon: 'credit-card',
    color: '#666666',
    pattern: /.*/,
  },
};

export default function PaymentPage() {
  const { colors } = useTheme();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [detectedCardType, setDetectedCardType] = useState<CardType>('unknown');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    // Dummy data - replace with actual API calls
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      cardType: 'visa',
    },
    {
      id: '2',
      type: 'UPI',
      upiId: 'user@upi',
    },
    {
      id: '3',
      type: 'Net Banking',
      bankName: 'HDFC Bank',
    },
  ]);

  const banks = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India',
    'Axis Bank',
    'Kotak Mahindra Bank',
  ];

  const detectCardType = (number: string): CardType => {
    const cleanedNumber = number.replace(/\s/g, '');
    for (const [type, info] of Object.entries(CARD_TYPES)) {
      if (info.pattern.test(cleanedNumber)) {
        return type as CardType;
      }
    }
    return 'unknown';
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : cleaned;
    setDetectedCardType(detectCardType(formatted));
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateCard = () => {
    if (!name.trim()) {
      setSnackbarMessage('Please enter cardholder name');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return false;
    }
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setSnackbarMessage('Please enter a valid 16-digit card number');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return false;
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setSnackbarMessage('Please enter a valid expiry date (MM/YY)');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return false;
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      setSnackbarMessage('Please enter a valid CVV');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const validateUPI = () => {
    if (!upiId.match(/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z._]{2,49}$/)) {
      setSnackbarMessage('Please enter a valid UPI ID');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const validateNetBanking = () => {
    if (!selectedBank) {
      setSnackbarMessage('Please select a bank');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    try {
      let isValid = false;
      switch (selectedPaymentMethod) {
        case 'card':
          isValid = validateCard();
          break;
        case 'upi':
          isValid = validateUPI();
          break;
        case 'netbanking':
          isValid = validateNetBanking();
          break;
      }

      if (!isValid) {
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPaymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: selectedPaymentMethod === 'card' ? CARD_TYPES[detectedCardType].name : 
              selectedPaymentMethod === 'upi' ? 'UPI' : 'Net Banking',
        ...(selectedPaymentMethod === 'card' && {
          last4: cardNumber.slice(-4),
          expiryDate: expiryDate,
          cardType: detectedCardType,
        }),
        ...(selectedPaymentMethod === 'upi' && {
          upiId: upiId,
        }),
        ...(selectedPaymentMethod === 'netbanking' && {
          bankName: selectedBank,
        }),
      };

      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      setSnackbarMessage('Payment method added successfully');
      setSnackbarType('success');
      setSnackbarVisible(true);
      
      // Reset form
      setName('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setUpiId('');
      setSelectedBank('');
      setDetectedCardType('unknown');
    } catch (error) {
      setSnackbarMessage('Failed to add payment method');
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
            setSnackbarMessage('Payment method deleted successfully');
            setSnackbarType('success');
            setSnackbarVisible(true);
          },
        },
      ]
    );
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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 16,
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardType: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    cardNumber: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
    cardExpiry: {
      fontSize: 14,
      color: colors.text,
    },
    form: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      opacity: loading ? 0.7 : 1,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    paymentMethodSelector: {
      flexDirection: 'row',
      marginBottom: 16,
      gap: 8,
    },
    paymentMethodButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    paymentMethodButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    paymentMethodText: {
      color: colors.text,
      fontSize: 14,
    },
    paymentMethodTextActive: {
      color: '#fff',
    },
    bankSelector: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 16,
    },
    bankOption: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bankOptionSelected: {
      backgroundColor: colors.primary + '20',
    },
    deleteButton: {
      padding: 8,
      marginTop: 8,
    },
    deleteButtonText: {
      color: '#ff4444',
      fontSize: 14,
    },
    cardTypeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardTypeIcon: {
      marginRight: 8,
    },
    cardTypeText: {
      fontSize: 14,
      color: colors.text,
    },
    cardPreview: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPreviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardPreviewNumber: {
      fontSize: 20,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    cardPreviewDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardPreviewName: {
      fontSize: 14,
      color: colors.text,
    },
    cardPreviewExpiry: {
      fontSize: 14,
      color: colors.text,
    },
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{method.type}</Text>
                {method.type !== 'UPI' && method.type !== 'Net Banking' && (
                  <MaterialIcons 
                    name={CARD_TYPES[method.cardType as CardType]?.icon as MaterialIconName} 
                    size={24} 
                    color={CARD_TYPES[method.cardType as CardType]?.color || colors.text} 
                  />
                )}
                {method.type === 'UPI' && <MaterialIcons name="account-balance-wallet" size={24} color={colors.text} />}
                {method.type === 'Net Banking' && <MaterialIcons name="account-balance" size={24} color={colors.text} />}
              </View>
              {method.type !== 'UPI' && method.type !== 'Net Banking' && (
                <>
                  <Text style={styles.cardNumber}>•••• •••• •••• {method.last4}</Text>
                  <Text style={styles.cardExpiry}>Expires {method.expiryDate}</Text>
                </>
              )}
              {method.type === 'UPI' && (
                <Text style={styles.cardNumber}>{method.upiId}</Text>
              )}
              {method.type === 'Net Banking' && (
                <Text style={styles.cardNumber}>{method.bankName}</Text>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePaymentMethod(method.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Payment Method</Text>
          <View style={styles.form}>
            <View style={styles.paymentMethodSelector}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'card' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setSelectedPaymentMethod('card')}
              >
                <Text style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === 'card' && styles.paymentMethodTextActive,
                ]}>Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'upi' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setSelectedPaymentMethod('upi')}
              >
                <Text style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === 'upi' && styles.paymentMethodTextActive,
                ]}>UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'netbanking' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setSelectedPaymentMethod('netbanking')}
              >
                <Text style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === 'netbanking' && styles.paymentMethodTextActive,
                ]}>Net Banking</Text>
              </TouchableOpacity>
            </View>

            {selectedPaymentMethod === 'card' && (
              <>
                {cardNumber && (
                  <View style={[styles.cardPreview, { borderColor: CARD_TYPES[detectedCardType].color }]}>
                    <View style={styles.cardPreviewHeader}>
                      <MaterialIcons 
                        name={CARD_TYPES[detectedCardType].icon as MaterialIconName} 
                        size={32} 
                        color={CARD_TYPES[detectedCardType].color} 
                      />
                      <Text style={[styles.cardTypeText, { color: CARD_TYPES[detectedCardType].color }]}>
                        {CARD_TYPES[detectedCardType].name}
                      </Text>
                    </View>
                    <Text style={styles.cardPreviewNumber}>{cardNumber}</Text>
                    <View style={styles.cardPreviewDetails}>
                      <Text style={styles.cardPreviewName}>{name || 'CARDHOLDER NAME'}</Text>
                      <Text style={styles.cardPreviewExpiry}>{expiryDate || 'MM/YY'}</Text>
                    </View>
                  </View>
                )}
                <TextInput
                  label="Cardholder Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Card Number"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  maxLength={19}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TextInput
                    label="Expiry Date"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    placeholder="MM/YY"
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    mode="outlined"
                    maxLength={5}
                  />
                  <TextInput
                    label="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    mode="outlined"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
              </>
            )}

            {selectedPaymentMethod === 'upi' && (
              <TextInput
                label="UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                placeholder="username@upi"
                style={styles.input}
                mode="outlined"
              />
            )}

            {selectedPaymentMethod === 'netbanking' && (
              <View style={styles.bankSelector}>
                {banks.map((bank) => (
                  <TouchableOpacity
                    key={bank}
                    style={[
                      styles.bankOption,
                      selectedBank === bank && styles.bankOptionSelected,
                    ]}
                    onPress={() => setSelectedBank(bank)}
                  >
                    <Text style={{ color: colors.text }}>{bank}</Text>
                    {selectedBank === bank && (
                      <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleAddPaymentMethod}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Adding...' : 'Add Payment Method'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === 'success' ? '#4CAF50' : '#f44336',
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}
