import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createGenerationJob, getGenerationStatus } from '../api/routes';
import { GradientBackground } from '../components/ui/GradientBackground';
import { Chip } from '../components/ui/Chip';
import { GlassCard } from '../components/ui/GlassCard';
import { NeoButton } from '../components/ui/NeoButton';
import { ROUTE_WIZARD_QUESTIONS } from '../constants/questions';
import { COLORS } from '../constants/theme';
import { useWizardStore } from '../store/wizard.store';
import type { AppStackParamList } from '../types/navigation';
import type { RouteGeneratePayload } from '../types/api';

const TOTAL_STEPS = ROUTE_WIZARD_QUESTIONS.length;

type WizardNav = NativeStackNavigationProp<AppStackParamList, 'RouteWizard'>;

export const RouteWizardScreen: React.FC = () => {
  const navigation = useNavigation<WizardNav>();
  const { stepIndex, answers, setAnswer, next, prev, reset } = useWizardStore();
  const currentQuestion = ROUTE_WIZARD_QUESTIONS[stepIndex];
  const [value, setValue] = useState<string>(answers[currentQuestion.field]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(answers[currentQuestion.field]);
    setError(null);
  }, [currentQuestion.field, answers]);

  const progress = useMemo(() => Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100), [stepIndex]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createGenerationJob,
    onSuccess: async ({ job_id }) => {
      try {
        const started = Date.now();
        const timeoutMs = 120_000; // 2 min guard
        // poll until done or timeout
        // small initial delay to let job switch to running
        await new Promise((r) => setTimeout(r, 400));
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const status = await getGenerationStatus(job_id);
          if (status.status === 'done' && status.route) {
            reset();
            navigation.navigate('RouteResult', { route: {
              route_id: String(status.route.id),
              title: status.route.title,
              summary: status.route.summary,
              steps: status.route.steps,
              yandex_url: status.route.yandex_url ?? undefined,
              created_at: status.route.created_at,
              raw_response: status.route.raw_response ?? '',
            } });
            break;
          }
          if (status.status === 'error') {
            setError(status.error || 'Ошибка генерации маршрута');
            break;
          }
          if (Date.now() - started > timeoutMs) {
            setError('Истекло время ожидания генерации маршрута');
            break;
          }
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Не удалось получить статус задачи';
        setError(message);
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Не удалось запустить задачу';
      setError(message);
    },
  });

  const handleNext = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Поле не может быть пустым');
      return;
    }

    const payload = { ...answers, [currentQuestion.field]: trimmed } as RouteGeneratePayload;
    setAnswer(currentQuestion.field, trimmed);
    setError(null);

    if (stepIndex === TOTAL_STEPS - 1) {
      void mutateAsync(payload);
    } else {
      next();
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigation.goBack();
    } else {
      prev();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setValue(suggestion);
    setAnswer(currentQuestion.field, suggestion);
    setError(null);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} onPress={handleBack} />
          <Text style={styles.progressLabel}>Шаг {stepIndex + 1} из {TOTAL_STEPS}</Text>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <GlassCard style={{ flexGrow: 1 }}>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionDescription}>{currentQuestion.description}</Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={currentQuestion.placeholder}
            placeholderTextColor="rgba(148, 163, 184, 0.5)"
            multiline
            style={styles.input}
            editable={!isPending}
          />

          {currentQuestion.suggestions ? (
            <View style={styles.suggestions}>
              {currentQuestion.suggestions.map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  selected={value === suggestion}
                  onPress={() => handleSuggestion(suggestion)}
                />
              ))}
            </View>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <NeoButton
            title={stepIndex === TOTAL_STEPS - 1 ? 'Получить маршрут' : 'Далее'}
            onPress={handleNext}
            loading={isPending}
            disabled={isPending}
          />
        </GlassCard>

        <Text style={styles.hint}>Отвечай свободно — ИИ-агент превратит твои пожелания в идеальный маршрут.</Text>

        {isPending ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.accentMint} />
            <Text style={styles.loadingText}>Готовим самостоятельное приключение по Москве...</Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  progressBar: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    height: 3,
    borderRadius: 999,
    backgroundColor: COLORS.accentMint,
  },
  questionTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 22,
    marginBottom: 12,
  },
  questionDescription: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginBottom: 20,
  },
  input: {
    minHeight: 100,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  error: {
    color: COLORS.accentPink,
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
  },
  hint: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    paddingHorizontal: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  loadingText: {
    color: COLORS.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
});

export default RouteWizardScreen;
