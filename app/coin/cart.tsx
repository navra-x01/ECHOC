import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Linking, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc, getDoc, collection, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../../lib/AuthProvider';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

function getStringParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

const NETWORK_FEE = 2.5; // USD, mock value
const PLATFORM_FEE_RATE = 0.01; // 1%
const PRICE_UPDATE_THRESHOLD = 0.5; // USD
const QUOTE_VALIDITY_SECONDS = 60;

export default function CartPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(getStringParam(params.price));
  const [livePrice, setLivePrice] = useState(price);
  const [priceWarning, setPriceWarning] = useState(false);
  const [timer, setTimer] = useState(QUOTE_VALIDITY_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [userHoldings, setUserHoldings] = useState<number | null>(null);
  const [status, setStatus] = useState<'pending' | 'confirmed' | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  const type = getStringParam(params.type);
  const coinId = getStringParam(params.coinId);
  const coinName = getStringParam(params.coinName);
  const coinSymbol = getStringParam(params.coinSymbol);
  const amount = getStringParam(params.amount);
  const image = getStringParam(params.image);

  const subtotal = parseFloat(amount) * parseFloat(price);
  const platformFee = subtotal * PLATFORM_FEE_RATE;
  const networkFee = NETWORK_FEE;
  const total = type === 'buy' ? subtotal + platformFee + networkFee : subtotal - platformFee - networkFee;

  // Fetch user balance and holdings
  useEffect(() => {
    if (!user) return;
    (async () => {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      setUserBalance(userDoc.data()?.balance || 0);
      const coinsRef = collection(db, "users", user.uid, "coins");
      const coinDocRef = doc(coinsRef, coinId);
      const coinDoc = await getDoc(coinDocRef);
      setUserHoldings(coinDoc.exists() ? (coinDoc.data().quantity || 0) : 0);
    })();
  }, [user, coinId]);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // Live price update simulation (fetch new price every 10s)
  useEffect(() => {
    const interval = setInterval(async () => {
      // Simulate fetching live price (replace with real API if needed)
      // For now, just add a small random fluctuation
      const newPrice = (parseFloat(price) + (Math.random() - 0.5) * 1).toFixed(2);
      setLivePrice(newPrice);
      if (Math.abs(parseFloat(newPrice) - parseFloat(price)) > PRICE_UPDATE_THRESHOLD) {
        setPriceWarning(true);
      } else {
        setPriceWarning(false);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [price]);

  const handleEdit = () => {
    router.replace({
      pathname: '/coin',
      params: {
        id: coinId,
        showTransactionModal: 'true',
        transactionType: type,
        amount: amount
      }
    });
  };

  const handleHelp = () => {
    Linking.openURL('https://www.investopedia.com/cryptocurrency-4427699');
  };

  const handleShareReceipt = async () => {
    if (!receipt) return;
    await Share.share({ message: receipt });
  };

  const handleDownloadPDF = async () => {
    if (!receipt) return;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2 style="text-align:center;">Transaction Receipt</h2>
        <hr />
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Status:</strong> Confirmed</p>
        <p><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <p><strong>Coin:</strong> ${coinName} (${coinSymbol.toUpperCase()})</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Price per Coin:</strong> $${parseFloat(price).toLocaleString()}</p>
        <div style="margin: 16px 0;">
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:4px 0;">Subtotal</td><td style="text-align:right;">$${subtotal.toFixed(2)}</td></tr>
            <tr><td style="padding:4px 0;">Platform Fee (1%)</td><td style="text-align:right;">$${platformFee.toFixed(2)}</td></tr>
            <tr><td style="padding:4px 0;">Network Fee</td><td style="text-align:right;">$${networkFee.toFixed(2)}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-top:1px solid #eee;">Total</td><td style="text-align:right; font-weight:bold; border-top:1px solid #eee;">$${total.toFixed(2)}</td></tr>
          </table>
        </div>
        <p style="margin-top:24px; font-size:12px; color:#888;">Thank you for using our platform!</p>
      </div>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share or Save PDF Receipt' });
    } catch (e) {
      Alert.alert('Error', 'Could not generate PDF');
    }
  };

  const handleConfirm = async () => {
    if (!agreed || !user) return;
    setLoading(true);
    setStatus('pending');
    try {
      // Validate transaction amount
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        Alert.alert("Error", "Please enter a valid amount");
        setLoading(false);
        setStatus(null);
        return;
      }
      // Update user's balance and coin holdings
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const currentBalance = userDoc.data()?.balance || 0;
      const transactionAmount = subtotal;
      // Check if user has enough balance for buying
      if (type === 'buy' && currentBalance < total) {
        Alert.alert("Error", "Insufficient balance");
        setLoading(false);
        setStatus(null);
        return;
      }
      // Check if user has enough coins for selling
      const coinsRef = collection(db, "users", user.uid, "coins");
      const coinDocRef = doc(coinsRef, coinId);
      const coinDoc = await getDoc(coinDocRef);
      const currentQuantity = coinDoc.exists() ? (coinDoc.data().quantity || 0) : 0;
      if (type === 'sell' && currentQuantity < parseFloat(amount)) {
        Alert.alert("Error", "Insufficient coins");
        setLoading(false);
        setStatus(null);
        return;
      }
      // Save transaction history
      const transactionRef = collection(db, "users", user.uid, "transactions");
      const transactionData = {
        type,
        coinId,
        coinName,
        coinSymbol,
        quantity: parseFloat(amount),
        price: parseFloat(price),
        subtotal,
        platformFee,
        networkFee,
        total,
        timestamp: new Date(),
        status: 'confirmed',
      };
      await addDoc(transactionRef, transactionData);
      // Update balance
      await updateDoc(userRef, {
        balance: type === 'buy' 
          ? currentBalance - total 
          : currentBalance + total
      });
      // Update coin holdings
      const newQuantity = type === 'buy' 
        ? currentQuantity + parseFloat(amount) 
        : currentQuantity - parseFloat(amount);
      if (newQuantity <= 0) {
        await deleteDoc(coinDocRef);
      } else {
        await setDoc(coinDocRef, {
          symbol: coinSymbol,
          quantity: newQuantity,
          name: coinName,
          image: image
        });
      }
      setStatus('confirmed');
      const receiptText = `Transaction Receipt\nType: ${type}\nCoin: ${coinName} (${coinSymbol})\nAmount: ${amount}\nPrice: $${price}\nSubtotal: $${subtotal.toFixed(2)}\nPlatform Fee: $${platformFee.toFixed(2)}\nNetwork Fee: $${networkFee.toFixed(2)}\nTotal: $${total.toFixed(2)}\nStatus: Confirmed\nDate: ${new Date().toLocaleString()}`;
      setReceipt(receiptText);
      Alert.alert('Success', `You have confirmed to ${type} ${amount} ${coinSymbol}`);
      // router.replace(`/coin?id=${coinId}`); // Optionally redirect after a delay
    } catch (error) {
      console.error("Transaction error:", error);
      Alert.alert("Error", "Failed to complete transaction");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Security tips
  const securityTip = "Never share your private keys or passwords with anyone. Always double-check the transaction details before confirming.";

  // Coin info link
  const coinInfoUrl = `https://www.coingecko.com/en/coins/${coinId}`;

  // Transaction status display
  let statusText = '';
  if (status === 'pending') statusText = 'Transaction Pending...';
  if (status === 'confirmed') statusText = 'Transaction Confirmed!';

  // Post-transaction: show share receipt button
  const showShareReceipt = status === 'confirmed' && receipt;

  // Show warning if price changed significantly
  const showPriceWarning = priceWarning && timer > 0;

  // Show timer expired warning
  const showTimerExpired = timer === 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, {paddingBottom: 48}]}>
      <Text style={styles.header}>{type === 'buy' ? 'Buy' : 'Sell'} Confirmation</Text>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => Linking.openURL(coinInfoUrl)}>
          <Image source={{ uri: image }} style={styles.coinImage} />
        </TouchableOpacity>
        <Text style={styles.coinName}>{coinName} ({coinSymbol.toUpperCase()})</Text>
        <Text style={styles.infoLink} onPress={() => Linking.openURL(coinInfoUrl)}>
          More info about this coin
        </Text>
        <View style={styles.breakdownTable}>
          <Text style={styles.breakdownHeader}>Transaction Breakdown</Text>
          <View style={styles.breakdownRow}><Text>Subtotal</Text><Text>${subtotal.toFixed(2)}</Text></View>
          <View style={styles.breakdownRow}><Text>Platform Fee (1%)</Text><Text>${platformFee.toFixed(2)}</Text></View>
          <View style={styles.breakdownRow}><Text>Network Fee</Text><Text>${networkFee.toFixed(2)}</Text></View>
          <View style={styles.breakdownRowTotal}><Text style={{fontWeight:'bold'}}>Total</Text><Text style={{fontWeight:'bold'}}>${total.toFixed(2)}</Text></View>
        </View>
        {showPriceWarning && (
          <Text style={styles.warningText}>Price has changed significantly! Please review before confirming.</Text>
        )}
        <View style={styles.timerRow}>
          <Text style={styles.timerText}>Quote valid for: {timer}s</Text>
          {showTimerExpired && <Text style={styles.warningText}>Quote expired. Please edit and try again.</Text>}
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit} disabled={loading || status === 'pending'}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.accountBox}>
        <Text style={styles.accountHeader}>Your Account</Text>
        <Text style={styles.accountText}>Current Balance: ${userBalance !== null ? userBalance.toLocaleString() : '...'}</Text>
        <Text style={styles.accountText}>Balance After: ${userBalance !== null ? (type === 'buy' ? (userBalance - total).toLocaleString() : (userBalance + total).toLocaleString()) : '...'}</Text>
        <Text style={styles.accountText}>Current {coinSymbol.toUpperCase()} Holdings: {userHoldings !== null ? userHoldings : '...'} {coinSymbol.toUpperCase()}</Text>
        <Text style={styles.accountText}>Holdings After: {userHoldings !== null ? (type === 'buy' ? (userHoldings + parseFloat(amount)) : (userHoldings - parseFloat(amount))) : '...'} {coinSymbol.toUpperCase()}</Text>
      </View>
      <View style={styles.securityBox}>
        <Text style={styles.securityHeader}>Security Tip</Text>
        <Text style={styles.securityText}>{securityTip}</Text>
      </View>
      <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
        <Text style={styles.helpButtonText}>Help / FAQ</Text>
      </TouchableOpacity>
      {status && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      )}
      <View style={styles.termsBox}>
        <Text style={styles.termsHeader}>Terms and Conditions</Text>
        <Text style={styles.termsText}>
          By proceeding, you agree to the terms and conditions of this transaction. Cryptocurrency transactions are irreversible and subject to market risk. Please review all details before confirming.
        </Text>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed(!agreed)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.confirmButton, { backgroundColor: agreed && timer > 0 && !loading && status !== 'confirmed' ? '#00f2ab' : '#ccc', marginBottom: 16 }]}
        disabled={!agreed || loading || timer === 0 || status === 'confirmed'}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmText}>{loading ? 'Processing...' : 'Confirm'}</Text>
      </TouchableOpacity>
      {showShareReceipt && (
        <View style={{flexDirection: 'row', gap: 12, marginBottom: 24, justifyContent: 'center'}}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareReceipt}>
            <Text style={styles.shareButtonText}>Share Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleDownloadPDF}>
            <Text style={styles.shareButtonText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#222', textAlign: 'center' },
  card: { width: '100%', backgroundColor: '#f7f7f7', borderRadius: 16, padding: 20, marginBottom: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  coinImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 12 },
  coinName: { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#333' },
  infoLink: { color: '#2980b9', fontSize: 14, marginBottom: 8, textDecorationLine: 'underline' },
  breakdownTable: { width: '100%', marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#eee' },
  breakdownHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  breakdownRowTotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 6 },
  warningText: { color: '#e67e22', fontWeight: 'bold', marginBottom: 8 },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timerText: { color: '#555', fontSize: 14, marginRight: 8 },
  editButton: { backgroundColor: '#eee', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 20, marginBottom: 8 },
  editButtonText: { color: '#2980b9', fontWeight: 'bold' },
  termsBox: { width: '100%', backgroundColor: '#f1f1f1', borderRadius: 12, padding: 16, marginBottom: 24 },
  termsHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#222' },
  termsText: { fontSize: 14, color: '#555', marginBottom: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#00b894', borderRadius: 4, marginRight: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#00b894', borderColor: '#00b894' },
  checkboxInner: { width: 12, height: 12, backgroundColor: '#fff', borderRadius: 2 },
  checkboxLabel: { fontSize: 14, color: '#333' },
  accountBox: { width: '100%', backgroundColor: '#f7f7f7', borderRadius: 12, padding: 16, marginBottom: 24 },
  accountHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#222' },
  accountText: { fontSize: 14, color: '#555', marginBottom: 4 },
  securityBox: { width: '100%', backgroundColor: '#eafaf1', borderRadius: 12, padding: 16, marginBottom: 24 },
  securityHeader: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#00b894' },
  securityText: { fontSize: 14, color: '#333' },
  helpButton: { backgroundColor: '#eee', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 20, marginBottom: 16 },
  helpButtonText: { color: '#2980b9', fontWeight: 'bold' },
  statusBox: { width: '100%', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 16, alignItems: 'center' },
  statusText: { fontWeight: 'bold', color: '#2980b9', fontSize: 16 },
  confirmButton: { width: '100%', padding: 16, borderRadius: 10, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  shareButton: { backgroundColor: '#00b894', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginTop: 16 },
  shareButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 