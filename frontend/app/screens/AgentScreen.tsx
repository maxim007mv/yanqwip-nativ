import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenShell } from '@/components/ScreenShell';
import { GlassCard } from '@/components/GlassCard';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { ChatMessage } from '@/lib/types';
import { agentApi } from '@/api';

const SUGGESTIONS = [
  'Где поесть роллов рядом?',
  'Романтический ресторан',
  'Парки для прогулки',
  'Музеи Москвы',
];

interface RenderMessageProps {
  item: ChatMessage;
  index: number;
}

export default function AgentScreen() {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Привет! Я твой персональный гид. Чем могу помочь? 😊',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleSuggestionPress = (text: string) => {
    sendMessage(text);
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const trimmed = text.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInputText('');
    setIsTyping(true);
    scrollToTop();

    try {
      const history = messages.slice(0, 10).reverse();
      const stream = await agentApi.chat(trimmed, history);

      let botResponse = '';
      const botMessageId = (Date.now() + 1).toString();
      const botMessage: ChatMessage = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [botMessage, ...prev]);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botResponse += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: botResponse } : msg
          )
        );
      }
      setIsTyping(false);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте ещё раз.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [errorMessage, ...prev]);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const renderMessage = ({ item }: RenderMessageProps) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowBot,
        ]}
      >
        {!isUser && (
          <View
            style={[
              styles.rowAvatar,
              { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
            ]}
          >
            <LinearGradient
              colors={['#263244', '#171D27']}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="sparkles" size={16} color={colors.accent} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? styles.messageBubbleUser
              : [
                  styles.messageBubbleBot,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: colors.glassBorder,
                  },
                ],
          ]}
        >
          {isUser ? (
            <LinearGradient
              colors={[colors.accent, colors.accent2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <Text
            style={[
              styles.messageText,
              {
                color: isUser ? '#2B1F05' : colors.text1,
                fontFamily: isUser
                  ? Typography.interSemiBold
                  : Typography.interMedium,
              },
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              {
                color: isUser ? '#5D4820' : colors.text3,
              },
            ]}
          >
            {item.timestamp.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderTyping = useMemo(
    () =>
      isTyping ? (
        <View style={styles.messageRowBot}>
          <View
            style={[
              styles.rowAvatar,
              { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
            ]}
          >
            <LinearGradient
              colors={['#263244', '#171D27']}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="sparkles" size={16} color={colors.accent} />
          </View>
          <View
            style={[
              styles.messageBubble,
              styles.messageBubbleBot,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <TypingIndicator colors={colors} />
          </View>
        </View>
      ) : null,
    [colors, isTyping]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View
            style={[
              styles.shellWrapper,
              {
                paddingBottom: Layout.dockOffset + Spacing.xl,
              },
            ]}
          >
            <ScreenShell
              style={styles.shell}
              contentStyle={[styles.shellContent]}
            >
            <GlassCard style={styles.header} borderRadius="xxl">
              <View style={styles.headerContent}>
                <View
                  style={[
                    styles.agentAvatar,
                    { borderColor: colors.glassBorder },
                  ]}
                >
                  <LinearGradient
                    colors={['#263244', '#171D27']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Ionicons name="sparkles" size={20} color={colors.accent} />
                  <View style={styles.statusDot} />
                </View>
                <View style={styles.agentInfo}>
                  <Text
                    style={[
                      styles.agentTitle,
                      { color: colors.text1, fontFamily: Typography.interSemiBold },
                    ]}
                  >
                    ИИ-агент
                  </Text>
                  <Text
                    style={[
                      styles.agentSubtitle,
                      { color: colors.text3, fontFamily: Typography.interMedium },
                    ]}
                  >
                    Онлайн • Готов помочь
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.cornerButton,
                    { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
                  ]}
                  onPress={() => {}}
                  activeOpacity={0.85}
                >
                  <Feather name="more-horizontal" size={20} color={colors.text2} />
                </TouchableOpacity>
              </View>
            </GlassCard>

            {messages.length === 1 ? (
              <View style={styles.suggestions}>
                <Text
                  style={[
                    styles.suggestionsTitle,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  Популярные вопросы:
                </Text>
                <View style={styles.suggestionsList}>
                  {SUGGESTIONS.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestionChip,
                        {
                          backgroundColor: colors.glassBg,
                          borderColor: colors.glassBorder,
                        },
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text
                        style={[
                          styles.suggestionText,
                          { color: colors.text1, fontFamily: Typography.interSemiBold },
                        ]}
                      >
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

            <View
              style={[
                styles.chatSurface,
                {
                  borderColor: colors.glassBorder,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                },
              ]}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ['rgba(255, 184, 74, 0.05)', 'transparent']
                    : ['rgba(255, 184, 74, 0.12)', 'transparent']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                inverted
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messagesList}
                ListFooterComponent={renderTyping}
              />
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
              <GlassCard style={styles.composer} borderRadius="xxl">
                <View style={styles.composerContent}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.composerBtn,
                      {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderColor: colors.glassBorder,
                      },
                    ]}
                  >
                    <Feather name="paperclip" size={18} color={colors.text2} />
                  </TouchableOpacity>
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Напишите сообщение..."
                    placeholderTextColor={colors.text3}
                    style={[
                      styles.input,
                      { color: colors.text1, fontFamily: Typography.interMedium },
                    ]}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.sendButton,
                      !inputText.trim() && { opacity: 0.5 },
                    ]}
                    onPress={() => sendMessage(inputText)}
                    disabled={!inputText.trim()}
                  >
                    <LinearGradient
                      colors={[colors.accent, colors.accent2]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.sendGradient}
                    >
                      <Ionicons name="send" size={18} color="#2B1F05" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            </KeyboardAvoidingView>
          </ScreenShell>
        </View>
      </SafeAreaView>
    </View>
    </KeyboardAvoidingView>
  );
}

function TypingIndicator({ colors }: { colors: (typeof Colors)['dark'] | (typeof Colors)['light'] }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 420,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, [dot1, dot2, dot3]);

  const animateDot = (dot: Animated.Value) => ({
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View style={styles.typingContainer}>
      <Animated.View
        style={[
          styles.typingDot,
          { backgroundColor: colors.text2 },
          animateDot(dot1),
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { backgroundColor: colors.text2 },
          animateDot(dot2),
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          { backgroundColor: colors.text2 },
          animateDot(dot3),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  shellWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.pageTop,
    paddingHorizontal: Layout.screenGutter,
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxWidth,
  },
  shellContent: {
    flex: 1,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  header: {
    padding: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#13EF85',
    borderWidth: 2,
    borderColor: '#0B0D12',
  },
  agentInfo: {
    flex: 1,
  },
  agentTitle: {
    fontSize: Typography.body,
  },
  agentSubtitle: {
    fontSize: Typography.small,
    marginTop: 2,
  },
  cornerButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  suggestions: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  suggestionsTitle: {
    fontSize: Typography.caption,
    marginBottom: Spacing.md,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  suggestionChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: Typography.caption,
  },
  chatSurface: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.xxxl,
    overflow: 'hidden',
    position: 'relative',
  },
  messagesList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  messageBubbleUser: {
    borderBottomRightRadius: 10,
    elevation: 4,
  },
  messageBubbleBot: {
    borderBottomLeftRadius: 10,
    borderWidth: 1,
  },
  messageText: {
    fontSize: Typography.bodySmall,
    lineHeight: 21,
  },
  messageTime: {
    fontSize: Typography.tiny,
    marginTop: 6,
  },
  composer: {
    padding: Spacing.md,
    marginBottom: 90,
  },
  composerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  composerBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: Typography.body,
    maxHeight: 110,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
