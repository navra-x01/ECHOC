import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../lib/AuthProvider';
import { db } from '../../../lib/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export default function EditProfilePage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          name: data.name || '',
          email: user.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSnackbarMessage('Failed to load user data');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        // TODO: Upload image to storage and get URL
        setUserData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setSnackbarMessage('Failed to pick image');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        phone: userData.phone,
        bio: userData.bio,
        avatar: userData.avatar,
      });

      setSnackbarMessage('Profile updated successfully');
      setSnackbarType('success');
      setSnackbarVisible(true);
      
      // Navigate back to profile page after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Failed to update profile');
      setSnackbarType('error');
      setSnackbarVisible(true);
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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 16,
    },
    content: {
      padding: 16,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: '100%',
      height: 150,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    changePhotoButton: {
      backgroundColor: '#007AFF', // iOS blue color
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 8,
      alignSelf: 'center',
    },
    changePhotoText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    form: {
      marginTop: 16,
    },
    input: {
      marginBottom: 16,
      backgroundColor: 'transparent',
    },
    saveButton: {
      marginTop: 24,
      marginBottom: 24,
      backgroundColor: '#7E57C2', // Purple color from screenshot
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {userData.avatar ? (
              <Image
                source={{ uri: userData.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <MaterialIcons name="person" size={50} color={colors.text} />
            )}
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleImagePick}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Name"
            value={userData.name}
            onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Email"
            value={userData.email}
            onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
            style={styles.input}
            mode="outlined"
            disabled
            editable={false}
          />
          <TextInput
            label="Phone"
            value={userData.phone}
            onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          <TextInput
            label="Bio"
            value={userData.bio}
            onChangeText={(text) => setUserData(prev => ({ ...prev, bio: text }))}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          >
            Save Changes
          </Button>
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