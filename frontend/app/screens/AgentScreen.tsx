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
  ImageBackground,
  Dimensions,
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

const { width, height } = Dimensions.get('window');

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

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
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

    setMessages((prev) => [...prev, userMessage]); // Добавляем в конец
    setInputText('');
    setIsTyping(true);

    setTimeout(scrollToBottom, 100);

    try {
      const history = messages.slice(0, 10).reverse();
      const result = await agentApi.chat(trimmed, history);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]); // Добавляем в конец
      setIsTyping(false);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте еще раз.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]); // Добавляем в конец
      setIsTyping(false);
    }
  };

  const handleSuggestionPress = (text: string) => {
    sendMessage(text);
  };

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
    <ImageBackground
      source={require('@/assets/images/agent_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={12}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Header */}
          <View style={styles.headerWrapper}>
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
          </View>

          {/* Suggestions - показываем только если всего 1 сообщение */}
          {messages.length === 1 && (
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
          )}

          {/* Chat Area */}
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
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.messagesList,
                { paddingBottom: Layout.dockOffset + 20 },
              ]}
              ListFooterComponent={renderTyping}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {/* Composer */}
          <View style={styles.composerWrapper}>
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
                  returnKeyType="send"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    if (inputText.trim()) {
                      sendMessage(inputText);
                    }
                  }}
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
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
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
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  const animateDot = (dot: Animated.Value, baseOpacity: number, translateY: number) => ({
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [baseOpacity, 0.82],
    }),
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, translateY],
        }),
      },
    ],
  });

  return (
    <View style={styles.typingContainer}>
      <Animated.View
        style={[
          styles.typingDot,
          animateDot(dot1, 0.4, -0.757675),
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          animateDot(dot2, 0.513651, -3.17578),
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          animateDot(dot3, 0.876366, 0),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: Math.min(Layout.screenGutter, 16),
  },
  
  // Header
  headerWrapper: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
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

  // Suggestions
  suggestions: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.md,
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

  // Chat
  chatSurface: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.xxxl,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: Spacing.sm,
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    maxWidth: '100%',
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
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: width > 400 ? '75%' : '70%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  messageBubbleUser: {
    borderBottomRightRadius: 6,
    elevation: 4,
  },
  messageBubbleBot: {
    borderBottomLeftRadius: 6,
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

  // Composer
  composerWrapper: {
    paddingVertical: Spacing.sm,
    paddingBottom: Layout.dockOffset + Spacing.xl * 4,
  },
  composer: {
    padding: Spacing.md,
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
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: Typography.body,
    maxHeight: 110,
    minHeight: 40,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    flexShrink: 0,
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },

  // Typing Indicator
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
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
  },
});
