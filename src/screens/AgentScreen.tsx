import React, {useRef, useState, useEffect} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useFocusEffect} from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {sendAgentMessage} from '../api/agent';
import {GradientBackground} from '../components/ui/GradientBackground';
import {MessageBubble} from '../components/ui/MessageBubble';
import {COLORS} from '../constants/theme';
import type {AgentMessage} from '../types/api';

const QUICK_PROMPTS = [
  'Где провести романтический вечер?',
  'Подбери маршрут для детей на выходные',
  'Что посмотреть рядом с Красной площадью?',
  'Расскажи о музеях Москвы',
  'Где поесть недорого?',
  'Как добраться до ВДНХ?',
];

export const AgentScreen: React.FC = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<AgentMessage>>(null);

  // Очистка чата при каждом входе в экран
  useFocusEffect(
    React.useCallback(() => {
      setMessages([]);
      setInput('');
    }, []),
  );

  const {mutateAsync, isPending} = useMutation({
    mutationFn: async (text: string) => {
      const response = await sendAgentMessage(text, messages);
      return response.reply;
    },
    onSuccess: reply => {
      setMessages(prev => [...prev, {role: 'assistant', content: reply}]);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({animated: true}));
    },
  });

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;
    const userMessage: AgentMessage = {role: 'user', content: trimmed};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    void mutateAsync(trimmed);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({animated: true}));
  };

  const handlePrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>ИИ-агент Yanqwip</Text>
          {messages.length > 0 && (
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              <Ionicons name="refresh" size={20} color={COLORS.accentMint} />
              <Text style={styles.newChatText}>Новый чат</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>
          Задай вопрос — и получи тёплый, подробный ответ с рекомендациями по Москве.
        </Text>

        {messages.length === 0 ? (
          <View style={styles.prompts}>
            {QUICK_PROMPTS.map(prompt => (
              <TouchableOpacity
                key={prompt}
                style={styles.promptChip}
                onPress={() => handlePrompt(prompt)}>
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          data={messages}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => <MessageBubble content={item.content} role={item.role} />}
          keyExtractor={(_, index) => index.toString()}
        />

        {isPending && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Yanqwip печатает...</Text>
            <ActivityIndicator size="small" color={COLORS.accentMint} />
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Напиши сообщение..."
            placeholderTextColor="rgba(148, 163, 184, 0.6)"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, {opacity: input.trim() ? 1 : 0.6}]}
            onPress={handleSend}
            disabled={!input.trim() || isPending}>
            {isPending ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Ionicons name="send" size={18} color={COLORS.surface} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    fontFamily: 'Unbounded_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 26,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  prompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  promptChip: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  promptText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.accentMint,
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 16,
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    padding: 12,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    height: 44,
    width: 44,
    borderRadius: 16,
    backgroundColor: COLORS.accentMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: COLORS.accentMint,
  },
  newChatText: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.accentMint,
    fontSize: 12,
  },
});

export default AgentScreen;
