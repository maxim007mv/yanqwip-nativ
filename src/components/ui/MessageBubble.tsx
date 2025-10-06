import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ content, role }) => {
  const isUser = role === 'user';
  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          backgroundColor: isUser ? COLORS.accentMint : 'rgba(30, 41, 59, 0.85)',
        },
      ]}
    >
      <Text style={[styles.text, { color: isUser ? COLORS.surface : COLORS.textPrimary }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: '85%',
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 20,
  },
});
