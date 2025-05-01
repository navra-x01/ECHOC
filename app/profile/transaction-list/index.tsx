import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../lib/AuthProvider";
import { db } from "../../../lib/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import Header from "../../components/Header";

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
}

export default function TransactionList() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      if (!user) return;
      
      const transactionsRef = collection(db, "users", user.uid, "transactions");
      const q = query(transactionsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      
      const transactionData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Transaction[];
      
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Transaction History"
        rightComponent={null}
      />
      <View style={styles.content}>
        {loading ? (
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading transactions...</Text>
        ) : transactions.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text }]}>No transactions yet</Text>
        ) : (
          transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={[styles.transactionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/coin?id=${transaction.coinId}`)}
            >
              <View style={styles.transactionHeader}>
                <View style={styles.coinInfo}>
                  <Text style={[styles.coinName, { color: colors.text }]}>{transaction.coinName}</Text>
                  <Text style={[styles.coinSymbol, { color: colors.text }]}>{transaction.coinSymbol.toUpperCase()}</Text>
                </View>
                <View style={[
                  styles.transactionType,
                  { backgroundColor: transaction.type === 'buy' ? '#10B981' : '#EF4444' }
                ]}>
                  {transaction.type === 'buy' ? (
                    <ArrowUpRight size={16} color="white" />
                  ) : (
                    <ArrowDownRight size={16} color="white" />
                  )}
                  <Text style={styles.transactionTypeText}>
                    {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Quantity:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {transaction.quantity.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Price:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    ${transaction.price.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Total:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    ${transaction.total.toFixed(2)}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.timestamp, { color: colors.text }]}>
                {formatDate(transaction.timestamp)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
  },
  coinSymbol: {
    fontSize: 14,
    opacity: 0.7,
  },
  transactionType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  transactionTypeText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.5,
  },
});
