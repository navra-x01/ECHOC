import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from 'expo-router';
import Header from "../components/Header";

const initialArticles = [
  {
    title: "Blockchain Basics",
    description: "A comprehensive guide to blockchain fundamentals",
    url: "https://www.investopedia.com/terms/b/blockchain.asp",
    source: "Investopedia"
  },
  {
    title: "What is Cryptocurrency?",
    description: "Learn what cryptocurrency is and how it works",
    url: "https://www.coindesk.com/learn/what-is-cryptocurrency/",
    source: "CoinDesk"
  },
  {
    title: "How Bitcoin Works",
    description: "How Bitcoin operates as a peer-to-peer network",
    url: "https://www.bitcoin.com/get-started/how-bitcoin-works/",
    source: "Bitcoin.com"
  },
  {
    title: "Ethereum Explained",
    description: "What is Ethereum and how does it work?",
    url: "https://ethereum.org/en/what-is-ethereum/",
    source: "Ethereum.org"
  },
  {
    title: "Crypto Trading Strategies",
    description: "Learn effective trading strategies for crypto markets",
    url: "https://www.coindesk.com/learn/crypto-trading-strategies/",
    source: "CoinDesk"
  },
  {
    title: "DeFi Guide",
    description: "Introduction to Decentralized Finance (DeFi)",
    url: "https://www.gemini.com/cryptopedia/defi-decentralized-finance",
    source: "Gemini"
  },
  {
    title: "NFTs for Beginners",
    description: "What are NFTs and how do they work?",
    url: "https://www.coindesk.com/learn/what-are-nfts/",
    source: "CoinDesk"
  },
  {
    title: "Crypto Wallets",
    description: "What is a crypto wallet and how to use it",
    url: "https://www.coinbase.com/learn/crypto-basics/what-is-a-crypto-wallet",
    source: "Coinbase"
  },
  {
    title: "Crypto Security",
    description: "Best practices for keeping your crypto safe",
    url: "https://www.gemini.com/cryptopedia/crypto-security-best-practices",
    source: "Gemini"
  },
  {
    title: "Bitcoin Whitepaper",
    description: "The original Bitcoin whitepaper by Satoshi Nakamoto",
    url: "https://bitcoin.org/bitcoin.pdf",
    source: "Bitcoin.org"
  }
];

export default function ArticlesPage() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' cryptocurrency article')}`;
      Linking.openURL(searchUrl);
    }
  };

  const handleArticlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Essential Reading" />
        
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: '#4ECDC440'
            }]}
            placeholder="Search for crypto articles..."
            placeholderTextColor={colors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: '#4ECDC4' }]}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Featured Articles
          </Text>
          
          {initialArticles.map((article, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.articleCard, { backgroundColor: colors.card }]}
              onPress={() => handleArticlePress(article.url)}
            >
              <View style={styles.articleInfo}>
                <Text style={[styles.articleTitle, { color: colors.text }]}>
                  {article.title}
                </Text>
                <Text style={[styles.articleDescription, { color: colors.text }]}>
                  {article.description}
                </Text>
                <Text style={[styles.articleSource, { color: colors.text }]}>
                  {article.source}
                </Text>
              </View>
              <Ionicons name="open-outline" size={24} color="#4ECDC4" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  articleCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  articleInfo: {
    flex: 1,
    marginRight: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 20,
  },
  articleSource: {
    fontSize: 12,
    opacity: 0.6,
  },
}); 