import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/theme';
import { routesApi } from '@/api';
import { WizardAnswer } from '@/lib/types';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { RootStackParamList } from '@/navigation/RootNavigator';

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'multiple' | 'text';
  options: { value: string; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'budget',
    title: 'Какой у вас бюджет?',
    subtitle: 'Выберите примерный бюджет на маршрут',
    type: 'single',
    options: [
      { value: 'economy', label: 'Эконом (до 1000₽)', icon: 'wallet-outline' },
      { value: 'medium', label: 'Средний (1000-3000₽)', icon: 'cash-outline' },
      { value: 'premium', label: 'Премиум (3000₽+)', icon: 'diamond-outline' },
      { value: 'any', label: 'Любой', icon: 'infinite-outline' },
    ],
  },
  {
    id: 'categories',
    title: 'Что вас интересует?',
    subtitle: 'Выберите несколько категорий',
    type: 'multiple',
    options: [
      { value: 'cafe', label: 'Кафе', icon: 'cafe-outline' },
      { value: 'museum', label: 'Музеи', icon: 'business-outline' },
      { value: 'park', label: 'Парки', icon: 'leaf-outline' },
      { value: 'restaurant', label: 'Рестораны', icon: 'restaurant-outline' },
      { value: 'romantic', label: 'Романтика', icon: 'heart-outline' },
      { value: 'sport', label: 'Спорт', icon: 'fitness-outline' },
      { value: 'culture', label: 'Культура', icon: 'library-outline' },
      { value: 'shopping', label: 'Шопинг', icon: 'cart-outline' },
    ],
  },
  {
    id: 'tempo',
    title: 'Темп прогулки',
    subtitle: 'Насколько активный маршрут вы предпочитаете?',
    type: 'single',
    options: [
      { value: 'calm', label: 'Спокойный', icon: 'walk-outline' },
      { value: 'medium', label: 'Средний', icon: 'bicycle-outline' },
      { value: 'active', label: 'Активный', icon: 'speedometer-outline' },
    ],
  },
  {
    id: 'weather',
    title: 'Погодные предпочтения',
    subtitle: 'Какая погода для вас комфортна?',
    type: 'single',
    options: [
      { value: 'any', label: 'Любая', icon: 'partly-sunny-outline' },
      { value: 'sunny', label: 'Солнечно', icon: 'sunny-outline' },
      { value: 'cloudy', label: 'Облачно', icon: 'cloudy-outline' },
      { value: 'rain', label: 'Дождь', icon: 'rainy-outline' },
    ],
  },
  {
    id: 'timeOfDay',
    title: 'Время суток',
    subtitle: 'Когда планируете начать маршрут?',
    type: 'single',
    options: [
      { value: 'morning', label: 'Утро', icon: 'partly-sunny-outline' },
      { value: 'day', label: 'День', icon: 'sunny-outline' },
      { value: 'evening', label: 'Вечер', icon: 'moon-outline' },
      { value: 'night', label: 'Ночь', icon: 'moon-outline' },
    ],
  },
  {
    id: 'companions',
    title: 'С кем идёте?',
    subtitle: 'Компания влияет на выбор мест',
    type: 'single',
    options: [
      { value: 'alone', label: 'Один', icon: 'person-outline' },
      { value: 'couple', label: 'Пара', icon: 'people-outline' },
      { value: 'family', label: 'Семья', icon: 'home-outline' },
      { value: 'friends', label: 'Друзья', icon: 'people-circle-outline' },
    ],
  },
  {
    id: 'duration',
    title: 'Продолжительность',
    subtitle: 'Сколько времени готовы уделить?',
    type: 'single',
    options: [
      { value: '2-3', label: '2-3 часа', icon: 'time-outline' },
      { value: '4-6', label: '4-6 часов', icon: 'hourglass-outline' },
      { value: 'full', label: 'Весь день', icon: 'calendar-outline' },
    ],
  },
  {
    id: 'accessibility',
    title: 'Доступность',
    subtitle: 'Есть ли особые требования?',
    type: 'single',
    options: [
      { value: 'normal', label: 'Обычная', icon: 'walk-outline' },
      { value: 'wheelchair', label: 'Для колясок', icon: 'accessibility-outline' },
      { value: 'elderly', label: 'Для пожилых', icon: 'heart-outline' },
    ],
  },
  {
    id: 'transport',
    title: 'Транспорт',
    subtitle: 'Как планируете передвигаться?',
    type: 'single',
    options: [
      { value: 'walking', label: 'Пешком', icon: 'walk-outline' },
      { value: 'public', label: 'Общественный', icon: 'bus-outline' },
      { value: 'taxi', label: 'Такси', icon: 'car-outline' },
    ],
  },
  {
    id: 'preferences',
    title: 'Дополнительно',
    subtitle: 'Что ещё важно учесть?',
    type: 'multiple',
    options: [
      { value: 'photo', label: 'Красивые фото', icon: 'camera-outline' },
      { value: 'video', label: 'Видео-локации', icon: 'videocam-outline' },
      { value: 'reviews', label: 'Высокие рейтинги', icon: 'star-outline' },
      { value: 'price', label: 'Лучшая цена', icon: 'pricetag-outline' },
    ],
  },
];

export default function WizardScreen() {
  const { theme } = useUIStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const accentColor = colors.accent;
  const accent2Color = colors.accent2;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const currentQuestion = QUESTIONS[currentStep];
  const currentAnswer = answers[currentQuestion.id] || [];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelectOption = (value: string) => {
    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: [value] });
    } else {
      const current = answers[currentQuestion.id] || [];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [currentQuestion.id]: newValue });
    }
  };

  const handleNext = () => {
    if (currentAnswer.length === 0) {
      Alert.alert('Внимание', 'Пожалуйста, выберите хотя бы один вариант');
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Симуляция прогресса генерации
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 2000);

    try {
      const wizardAnswers: WizardAnswer[] = Object.entries(answers).map(([questionId, values]) => ({
        questionId,
        question: questionId,
        answer: values.join(', '),
        type: 'text' as const,
      }));

      const response = await routesApi.generate({
        answers: wizardAnswers,
        context: {
          city: 'Москва',
          budget: answers.budget?.[0],
          categories: (answers.categories || []) as any,
        },
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        navigation.navigate('RouteOverview', { routeId: response.route.id });
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setIsGenerating(false);
      Alert.alert('Ошибка', 'Не удалось сгенерировать маршрут. Попробуйте ещё раз.');
    }
  };

  if (isGenerating) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.generatingContainer}>
          <GlassCard style={styles.generatingCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.generatingTitle, { color: colors.text1 }]}>
              Генерируем маршрут...
            </Text>
            <Text style={[styles.generatingSubtitle, { color: colors.text2 }]}>
              {generationProgress < 30 && 'Шаг 1/3 — анализ ответов'}
              {generationProgress >= 30 && generationProgress < 60 && 'Шаг 2/3 — подбор локаций'}
              {generationProgress >= 60 && 'Шаг 3/3 — построение маршрута'}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={[colors.accent, colors.accent2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${generationProgress}%` }]}
                />
              </View>
            </View>
            <Text style={[styles.progressText, { color: colors.text3 }]}>
              {generationProgress}%
            </Text>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text1} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.stepText, { color: colors.text2 }]}>
            Шаг {currentStep + 1} из {QUESTIONS.length}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBg, { backgroundColor: colors.glassBg }]}>
          <LinearGradient
            colors={[colors.accent, colors.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.text1 }]}>
            {currentQuestion.title}
          </Text>
          {currentQuestion.subtitle && (
            <Text style={[styles.questionSubtitle, { color: colors.text2 }]}>
              {currentQuestion.subtitle}
            </Text>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer.includes(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelectOption(option.value)}
                style={styles.optionWrapper}
              >
                <GlassCard
                  style={[
                    styles.optionCard,
                    isSelected && {
                      borderColor: colors.accent,
                      borderWidth: 2,
                    },
                  ]}
                >
                  {option.icon && (
                    <Ionicons
                      name={option.icon}
                      size={32}
                      color={isSelected ? colors.accent : colors.text2}
                      style={styles.optionIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: isSelected ? colors.accent : colors.text1 },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                    </View>
                  )}
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer with Buttons */}
      <View style={styles.footer}>
        <Button
          title={currentStep === QUESTIONS.length - 1 ? 'Сгенерировать' : 'Далее'}
          onPress={handleNext}
          disabled={currentAnswer.length === 0}
          variant="accent"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: { padding: Spacing.xs },
  headerCenter: { flex: 1, alignItems: 'center' },
  stepText: { fontSize: Typography.caption, fontWeight: Typography.semiBold },
  headerRight: { width: 40 },
  progressContainer: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  progressBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  questionContainer: { marginBottom: Spacing.xl },
  questionTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },
  questionSubtitle: { fontSize: Typography.body },
  optionsContainer: { paddingBottom: Spacing.xl },
  optionWrapper: { marginBottom: Spacing.md },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    minHeight: 80,
  },
  optionIcon: { marginRight: Spacing.md },
  optionLabel: { flex: 1, fontSize: Typography.body, fontWeight: Typography.semiBold },
  checkmark: { position: 'absolute', top: Spacing.xs, right: Spacing.xs },
  footer: { padding: Spacing.md },
  generatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  generatingCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  generatingTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  generatingSubtitle: {
    fontSize: Typography.body,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  progressBarContainer: { width: '100%', marginBottom: Spacing.md },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: Typography.h3, fontWeight: Typography.bold },
});
