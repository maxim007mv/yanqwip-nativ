import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
  ImageBackground,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
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
    subtitle: 'можете выбрать несколько категорий',
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
  const isDark = theme === 'dark';
  const accentColor = colors.accent;
  const accent2Color = colors.accent2;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const customInputRef = useRef<TextInput>(null);

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
    // Переход на следующий вопрос без проверки выбора
    if (currentStep < QUESTIONS.length - 1) {
      setCustomInput(''); // Сбрасываем пользовательский ввод при переходе
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleSkip = () => {
    // Пропустить вопрос без проверки выбора
    if (currentStep < QUESTIONS.length - 1) {
      setCustomInput(''); // Сбрасываем пользовательский ввод при переходе
      setCurrentStep(currentStep + 1);
    } else {
      // Если это последний вопрос, генерируем маршрут
      handleGenerate();
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home' as never);
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

    // Симуляция прогресса генерации - 1 минута (60 секунд)
    // Обновляем каждые 0.5 секунды, увеличивая на 0.83% (100% / 60 сек / 2 обновления в секунду)
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 99) {
          clearInterval(progressInterval);
          return 99;
        }
        return prev + 0.83;
      });
    }, 500);

    try {
      const wizardAnswers: WizardAnswer[] = Object.entries(answers).map(([questionId, values]) => ({
        questionId,
        question: questionId,
        answer: values.join(', '),
        type: 'text' as const,
      }));
      
      // Добавляем пользовательский ввод, если он есть
      if (customInput.trim()) {
        wizardAnswers.push({
          questionId: 'custom',
          question: 'custom',
          answer: customInput.trim(),
          type: 'text' as const,
        });
      }

      console.log('🚀 Генерация маршрута начата');
      console.log('📝 Данные для отправки:', {
        answers: wizardAnswers,
        context: {
          city: 'Москва',
          budget: answers.budget?.[0],
          categories: (answers.categories || []) as any,
        },
      });

      const response = await routesApi.generate({
        answers: wizardAnswers,
        context: {
          city: 'Москва',
          budget: answers.budget?.[0],
          categories: (answers.categories || []) as any,
        },
      });

      console.log('✅ Маршрут получен:', response);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Ждем немного, чтобы показать 100%
      setTimeout(() => {
        setIsGenerating(false);
        // Передаём весь объект маршрута в RouteOverview
        // @ts-ignore - игнорируем ошибку типов навигации
        navigation.navigate('RouteOverview', { 
          route: response.route,
        });
      }, 1000);
    } catch (error: any) {
      console.error('❌ Ошибка генерации маршрута:', error);
      console.error('❌ Детали ошибки:', error.response?.data || error.message);
      clearInterval(progressInterval);
      setIsGenerating(false);
      Alert.alert(
        'Ошибка', 
        `Не удалось сгенерировать маршрут: ${error.response?.data?.detail || error.message || 'Попробуйте ещё раз'}`
      );
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
            {/* Проценты по центру экрана */}
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressText, { color: colors.text1 }]}>
                {Math.round(generationProgress)}%
              </Text>
            </View>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/agent_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={isDark ? 10 : 6}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']} pointerEvents="auto">
        {/* Современный Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBack} 
            style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text1} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.stepText, { color: colors.text1 }]}>
              {currentStep + 1}/{QUESTIONS.length}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={handleGoHome}
              style={styles.homeButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.accent, colors.accent2]}
                style={styles.homeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="home" size={20} color="#2B1F05" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSkip}
              style={[styles.skipButton, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.skipText, { color: colors.text2 }]}>Пропустить</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Улучшенный Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF6B6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Layout.dockOffset + 140, minHeight: '100%' },
        ]}
        pointerEvents="auto"
      >
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { color: colors.text1 }]}>
            {currentQuestion.title}
          </Text>
          {currentQuestion.subtitle && (
            <Text style={[styles.questionSubtitle, { 
              color: currentQuestion.type === 'multiple' ? colors.accent + 'CC' : colors.text2 
            }]}>
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
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? ['rgba(255, 215, 0, 0.3)', 'rgba(255, 165, 0, 0.2)']
                      : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                >
                  <View style={styles.optionContent}>
                    {option.icon && (
                      <View style={[
                        styles.iconContainer,
                        isSelected && { backgroundColor: 'rgba(255, 215, 0, 0.2)' }
                      ]}>
                        <Ionicons
                          name={option.icon}
                          size={28}
                          color={isSelected ? '#FFD700' : colors.text2}
                        />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? '#FFD700' : colors.text1 },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        style={styles.checkmarkCircle}
                      >
                        <Ionicons name="checkmark" size={18} color="#FFF" />
                      </LinearGradient>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
          
          {/* Поле для пользовательского ввода */}
          <TouchableOpacity
            style={styles.optionWrapper}
            activeOpacity={0.7}
            onPress={() => customInputRef.current?.focus()}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.customInputCard}
            >
              <View style={styles.customInputContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={colors.text2}
                  />
                </View>
                <TextInput
                  ref={customInputRef}
                  style={[
                    styles.customInput,
                    { color: colors.text1 },
                  ]}
                  placeholder="Введите свой вариант..."
                  placeholderTextColor={colors.text3}
                  value={customInput}
                  onChangeText={setCustomInput}
                  multiline={false}
                  maxLength={100}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Улучшенный Footer с кнопками */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          style={styles.nextButton}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={[styles.nextButtonText, { color: '#FFF' }]}>
              {currentStep === QUESTIONS.length - 1 ? '✨ Сгенерировать маршрут' : 'Далее →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    opacity: 0.6,
  },
  safeArea: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: { 
    padding: Spacing.sm,
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { 
    flex: 1, 
    alignItems: 'center',
  },
  stepText: { 
    fontSize: 18, 
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  homeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  homeButtonGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: { 
    paddingHorizontal: Spacing.lg, 
    paddingBottom: Spacing.lg,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { 
    height: '100%', 
    borderRadius: 3,
  },
  content: { 
    flex: 1, 
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  questionContainer: { 
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    lineHeight: 36,
  },
  questionSubtitle: { 
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
  },
  optionsContainer: { 
    paddingBottom: Spacing.xxl,
  },
  optionWrapper: { 
    marginBottom: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionCardSelected: {
    borderColor: 'rgba(255, 215, 0, 0.6)',
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionIcon: { 
    marginRight: Spacing.md,
  },
  optionLabel: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600',
    lineHeight: 22,
  },
  checkmark: { 
    marginLeft: Spacing.sm,
  },
  checkmarkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  customInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  footer: { 
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
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
  progressBarContainer: { 
    width: '100%', 
    marginBottom: Spacing.lg,
  },
  progressBarBg: {
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressBarFill: { 
    height: '100%', 
    borderRadius: 16,
  },
  progressTextContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  progressText: { 
    fontSize: Typography.h2, 
    fontWeight: Typography.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
