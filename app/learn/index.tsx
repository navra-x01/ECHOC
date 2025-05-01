import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Stack, router } from 'expo-router'
import Header from "../components/Header"

interface SectionProps {
  title: string
  description: string
  icon: string
  route: string
  color: string
  links: { title: string; url: string }[]
  searchPlaceholder: string
}

const sections: SectionProps[] = [
  {
    title: "Video Tutorials",
    description: "Watch easy-to-follow video guides about cryptocurrency and trading",
    icon: "play-circle",
    route: "/learn/videos",
    color: "#FF6B6B",
    searchPlaceholder: "Search for crypto videos...",
    links: [
      { title: "What is Bitcoin?", url: "https://www.youtube.com/watch?v=Gc2en3nHxA4" },
      { title: "How to Buy Cryptocurrency", url: "https://www.youtube.com/watch?v=Yb6825iv0Vk" },
      { title: "Crypto Trading Basics", url: "https://www.youtube.com/watch?v=1M24T8H97HQ" },
      { title: "Blockchain Explained", url: "https://www.youtube.com/watch?v=SSo_EIwHSd4" },
      { title: "Ethereum Explained", url: "https://www.youtube.com/watch?v=jxLkbJozKbY" },
      { title: "DeFi for Beginners", url: "https://www.youtube.com/watch?v=Oa8aT0QhYwA" },
      { title: "Crypto Wallets", url: "https://www.youtube.com/watch?v=8NH4OqF7Qzo" },
      { title: "How to Use Binance", url: "https://www.youtube.com/watch?v=2tBlHn2pA1g" },
      { title: "NFTs Explained", url: "https://www.youtube.com/watch?v=4Y0tOi7QWqM" },
      { title: "Crypto Security Tips", url: "https://www.youtube.com/watch?v=1YyAzVmPpF4" }
    ]
  },
  {
    title: "Essential Reading",
    description: "Read comprehensive articles and guides from crypto experts",
    icon: "document-text",
    route: "/learn/articles",
    color: "#4ECDC4",
    searchPlaceholder: "Search for crypto articles...",
    links: [
      { title: "Blockchain Basics", url: "https://www.investopedia.com/terms/b/blockchain.asp" },
      { title: "What is Cryptocurrency?", url: "https://www.coindesk.com/learn/what-is-cryptocurrency/" },
      { title: "How Bitcoin Works", url: "https://www.bitcoin.com/get-started/how-bitcoin-works/" },
      { title: "Ethereum Explained", url: "https://ethereum.org/en/what-is-ethereum/" },
      { title: "Crypto Trading Strategies", url: "https://www.coindesk.com/learn/crypto-trading-strategies/" },
      { title: "DeFi Guide", url: "https://www.gemini.com/cryptopedia/defi-decentralized-finance" },
      { title: "NFTs for Beginners", url: "https://www.coindesk.com/learn/what-are-nfts/" },
      { title: "Crypto Wallets", url: "https://www.coinbase.com/learn/crypto-basics/what-is-a-crypto-wallet" },
      { title: "Crypto Security", url: "https://www.gemini.com/cryptopedia/crypto-security-best-practices" },
      { title: "Bitcoin Whitepaper", url: "https://bitcoin.org/bitcoin.pdf" }
    ]
  },
  {
    title: "Beginner's Courses",
    description: "Take structured courses to master crypto trading and basics",
    icon: "school",
    route: "/learn/courses",
    color: "#45B7D1",
    searchPlaceholder: "Search for crypto courses...",
    links: [
      { title: "Crypto Fundamentals (Udemy)", url: "https://www.udemy.com/course/cryptocurrency-fundamentals/" },
      { title: "Blockchain and Bitcoin Fundamentals (Udemy)", url: "https://www.udemy.com/course/blockchain-and-bitcoin-fundamentals/" },
      { title: "Crypto Trading Masterclass (Udemy)", url: "https://www.udemy.com/course/crypto-trading-masterclass/" },
      { title: "Bitcoin and Cryptocurrency Technologies (Coursera)", url: "https://www.coursera.org/learn/cryptocurrency" },
      { title: "Blockchain Basics (Coursera)", url: "https://www.coursera.org/learn/blockchain-basics" },
      { title: "Ethereum and Solidity (Udemy)", url: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/" },
      { title: "DeFi and the Future of Finance (Coursera)", url: "https://www.coursera.org/learn/defi" },
      { title: "Crypto Security (Udemy)", url: "https://www.udemy.com/course/cryptocurrency-security/" },
      { title: "NFT Fundamentals (Udemy)", url: "https://www.udemy.com/course/nft-fundamentals/" },
      { title: "Introduction to Crypto Trading (Skillshare)", url: "https://www.skillshare.com/en/classes/Cryptocurrency-Trading-for-Beginners/2048573032" }
    ]
  }
]

export default function LearnPage() {
  const { colors } = useTheme();
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({});

  const handleSearch = (section: SectionProps, query: string) => {
    const searchUrl = section.title === "Video Tutorials" 
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : section.title === "Essential Reading"
      ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
      : `https://www.udemy.com/courses/search/?q=${encodeURIComponent(query)}`;
    
    Linking.openURL(searchUrl);
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const Section = ({ title, description, icon, route, color, links }: SectionProps) => (
    <TouchableOpacity
      style={[styles.sectionCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(route as any)}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.sectionDescription, { color: colors.text }]}>
        {description}
      </Text>
      <View style={styles.exploreButton}>
        <Text style={[styles.exploreText, { color: color }]}>Explore More</Text>
        <Ionicons name="arrow-forward" size={20} color={color} />
      </View>
    </TouchableOpacity>
  )

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Learn Crypto" />
        <View style={styles.content}>
          {sections.map((section, index) => (
            <Section key={index} {...section} />
          ))}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  sectionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 16,
    opacity: 0.85,
    lineHeight: 24,
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    letterSpacing: 0.3,
  },
}); 