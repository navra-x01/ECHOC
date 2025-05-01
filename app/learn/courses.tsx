import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from 'expo-router';
import Header from "../components/Header";

const initialCourses = [
  {
    title: "Crypto Fundamentals (Udemy)",
    description: "Learn the basics of cryptocurrency and blockchain technology",
    url: "https://www.udemy.com/course/cryptocurrency-fundamentals/",
    platform: "Udemy",
    rating: "4.7"
  },
  {
    title: "Blockchain and Bitcoin Fundamentals (Udemy)",
    description: "Master the core concepts of blockchain and Bitcoin",
    url: "https://www.udemy.com/course/blockchain-and-bitcoin-fundamentals/",
    platform: "Udemy",
    rating: "4.6"
  },
  {
    title: "Crypto Trading Masterclass (Udemy)",
    description: "Advanced trading strategies for cryptocurrency markets",
    url: "https://www.udemy.com/course/crypto-trading-masterclass/",
    platform: "Udemy",
    rating: "4.8"
  },
  {
    title: "Bitcoin and Cryptocurrency Technologies (Coursera)",
    description: "Comprehensive course on Bitcoin and cryptocurrencies",
    url: "https://www.coursera.org/learn/cryptocurrency",
    platform: "Coursera",
    rating: "4.7"
  },
  {
    title: "Blockchain Basics (Coursera)",
    description: "Learn the basics of blockchain technology",
    url: "https://www.coursera.org/learn/blockchain-basics",
    platform: "Coursera",
    rating: "4.6"
  },
  {
    title: "Ethereum and Solidity (Udemy)",
    description: "The complete developer's guide to Ethereum and Solidity",
    url: "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/",
    platform: "Udemy",
    rating: "4.7"
  },
  {
    title: "DeFi and the Future of Finance (Coursera)",
    description: "Introduction to DeFi and its impact on finance",
    url: "https://www.coursera.org/learn/defi",
    platform: "Coursera",
    rating: "4.8"
  },
  {
    title: "Crypto Security (Udemy)",
    description: "Best practices for cryptocurrency security",
    url: "https://www.udemy.com/course/cryptocurrency-security/",
    platform: "Udemy",
    rating: "4.6"
  },
  {
    title: "NFT Fundamentals (Udemy)",
    description: "Learn the basics of NFTs and their applications",
    url: "https://www.udemy.com/course/nft-fundamentals/",
    platform: "Udemy",
    rating: "4.5"
  },
  {
    title: "Introduction to Crypto Trading (Skillshare)",
    description: "A beginner's guide to cryptocurrency trading",
    url: "https://www.skillshare.com/en/classes/Cryptocurrency-Trading-for-Beginners/2048573032",
    platform: "Skillshare",
    rating: "4.5"
  }
];

export default function CoursesPage() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchUrl = `https://www.udemy.com/courses/search/?q=${encodeURIComponent(searchQuery + ' cryptocurrency')}`;
      Linking.openURL(searchUrl);
    }
  };

  const handleCoursePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Beginner's Courses" />
        
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: '#45B7D140'
            }]}
            placeholder="Search for crypto courses..."
            placeholderTextColor={colors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: '#45B7D1' }]}
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended Courses
          </Text>
          
          {initialCourses.map((course, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.courseCard, { backgroundColor: colors.card }]}
              onPress={() => handleCoursePress(course.url)}
            >
              <View style={styles.courseInfo}>
                <Text style={[styles.courseTitle, { color: colors.text }]}>
                  {course.title}
                </Text>
                <Text style={[styles.courseDescription, { color: colors.text }]}>
                  {course.description}
                </Text>
                <View style={styles.courseMeta}>
                  <Text style={[styles.coursePlatform, { color: colors.text }]}>
                    {course.platform}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={[styles.courseRating, { color: colors.text }]}>
                      {course.rating}
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="open-outline" size={24} color="#45B7D1" />
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
  courseCard: {
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
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 20,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coursePlatform: {
    fontSize: 12,
    opacity: 0.6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseRating: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
}); 