import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from 'expo-router';
import Header from "../components/Header";

const initialVideos = [
  {
    title: "What is Bitcoin?",
    description: "A beginner's guide to understanding Bitcoin",
    url: "https://www.youtube.com/watch?v=Gc2en3nHxA4",
    thumbnail: "https://img.youtube.com/vi/Gc2en3nHxA4/mqdefault.jpg"
  },
  {
    title: "How to Buy Cryptocurrency",
    description: "Step by step guide to buying your first crypto",
    url: "https://www.youtube.com/watch?v=Yb6825iv0Vk",
    thumbnail: "https://img.youtube.com/vi/Yb6825iv0Vk/mqdefault.jpg"
  },
  {
    title: "Crypto Trading Basics",
    description: "Learn the fundamentals of crypto trading",
    url: "https://www.youtube.com/watch?v=1M24T8H97HQ",
    thumbnail: "https://img.youtube.com/vi/1M24T8H97HQ/mqdefault.jpg"
  },
  {
    title: "Blockchain Explained",
    description: "Simple and visual explanation of blockchain technology",
    url: "https://www.youtube.com/watch?v=SSo_EIwHSd4",
    thumbnail: "https://img.youtube.com/vi/SSo_EIwHSd4/mqdefault.jpg"
  },
  {
    title: "Ethereum Explained",
    description: "What is Ethereum and how does it work?",
    url: "https://www.youtube.com/watch?v=jxLkbJozKbY",
    thumbnail: "https://img.youtube.com/vi/jxLkbJozKbY/mqdefault.jpg"
  },
  {
    title: "DeFi for Beginners",
    description: "Introduction to Decentralized Finance (DeFi)",
    url: "https://www.youtube.com/watch?v=Oa8aT0QhYwA",
    thumbnail: "https://img.youtube.com/vi/Oa8aT0QhYwA/mqdefault.jpg"
  },
  {
    title: "Crypto Wallets",
    description: "How to use and secure your crypto wallets",
    url: "https://www.youtube.com/watch?v=8NH4OqF7Qzo",
    thumbnail: "https://img.youtube.com/vi/8NH4OqF7Qzo/mqdefault.jpg"
  },
  {
    title: "How to Use Binance",
    description: "A guide to using the Binance exchange",
    url: "https://www.youtube.com/watch?v=2tBlHn2pA1g",
    thumbnail: "https://img.youtube.com/vi/2tBlHn2pA1g/mqdefault.jpg"
  },
  {
    title: "NFTs Explained",
    description: "What are NFTs and how do they work?",
    url: "https://www.youtube.com/watch?v=4Y0tOi7QWqM",
    thumbnail: "https://img.youtube.com/vi/4Y0tOi7QWqM/mqdefault.jpg"
  },
  {
    title: "Crypto Security Tips",
    description: "Best practices for keeping your crypto safe",
    url: "https://www.youtube.com/watch?v=1YyAzVmPpF4",
    thumbnail: "https://img.youtube.com/vi/1YyAzVmPpF4/mqdefault.jpg"
  }
];

export default function VideosPage() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' cryptocurrency')}`;
      Linking.openURL(searchUrl);
    }
  };

  const handleVideoPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Video Tutorials" />
        
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: '#FF6B6B40'
            }]}
            placeholder="Search for crypto videos..."
            placeholderTextColor={colors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: '#FF6B6B' }]}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Videos
          </Text>
          
          {initialVideos.map((video, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.videoCard, { backgroundColor: colors.card }]}
              onPress={() => handleVideoPress(video.url)}
            >
              <View style={styles.videoThumbnail}>
                <Ionicons name="play-circle" size={40} color="#FF6B6B" />
              </View>
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.text }]}>
                  {video.title}
                </Text>
                <Text style={[styles.videoDescription, { color: colors.text }]}>
                  {video.description}
                </Text>
              </View>
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
  videoCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
}); 