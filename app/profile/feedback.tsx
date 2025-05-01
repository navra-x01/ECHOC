import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/AuthProvider';

export default function FeedbackPage() {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      Alert.alert('Success', 'Thank you for your feedback!');
      setMessage('');
    } catch (error) {
      console.error('Error sending feedback:', error);
      Alert.alert('Error', 'Failed to send feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.text }]}>Send Feedback</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          We'd love to hear your thoughts, suggestions, or report any issues you're experiencing.
        </Text>
        
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Type your feedback here..."
          placeholderTextColor={colors.text + '99'}
          multiline
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            {isSubmitting ? 'Sending...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 0.5 },
  description: { fontSize: 16, color: '#666', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 150, textAlignVertical: 'top', fontSize: 16 },
  button: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12, marginTop: 8, shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontWeight: 'bold', fontSize: 18 },
}); 