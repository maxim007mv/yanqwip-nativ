// Profile Card Component - Улучшенная версия
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  ImageBackground,
  Animated,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList, MainTabParamList } from '@/navigation/RootNavigator';

import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { achievementsApi } from '@/api';
import { AchievementProgress } from '@/lib/types';

const { width, height } = Dimensions.get('window');

const STATS = [
  {
    label: 'Маршрутов',
    value: 12,
    icon: 'map',
    color: '#FF6B9D',
    gradient: ['#FF6B9D', '#FE8B99'],
  },
  {
    label: 'Мест',
    value: 38,
    icon: 'location',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#44A9A9'],
  },
  {
    label: 'Дней',
    value: 45,
    icon: 'calendar',
    color: '#FFB84A',
    gradient: ['#FFB84A', '#FFC566'],
  },
  {
    label: 'Км',
    value: 156,
    icon: 'walk',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#8B5CF6'],
  },
];

const QUICK_SETTINGS = [
  { id: 'theme', label: 'Тёмная тема', icon: 'moon', iconLight: 'sunny', type: 'switch' },
  { id: 'notifications', label: 'Уведомления', icon: 'notifications', type: 'switch' },
  { id: 'location', label: 'Геолокация', icon: 'location', type: 'switch' },
] as const;

type NavigationPropType = NavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { theme, toggleTheme } = useUIStore();
  const { user, logout, updateUser, isGuest, tokens } = useAuthStore();
  const navigation = useNavigation<NavigationPropType>();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Максим');
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementProgress | null>(null);
  const [achievementModalVisible, setAchievementModalVisible] = useState(false);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  const handleFavoritesPress = () => {
    // Переход на экран избранного
    navigation.navigate('Favorites' as never);
  };

  const handleHistoryPress = () => {
    // Переход на экран истории маршрутов
    navigation.navigate('RoutesHistory' as never);
  };

  const MENU_ITEMS = [
    {
      id: 'favorites',
      label: 'Избранное',
      icon: 'heart',
      badge: '12',
      gradient: ['#FF6B9D', '#FE8B99'],
      onPress: handleFavoritesPress,
    },
    {
      id: 'history',
      label: 'История маршрутов',
      icon: 'time',
      badge: 'new',
      gradient: ['#4ECDC4', '#44A9A9'],
      onPress: handleHistoryPress,
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: 'settings',
      badge: null,
      gradient: ['#A78BFA', '#8B5CF6'],
      onPress: () => {},
    },
    {
      id: 'help',
      label: 'Помощь',
      icon: 'help-circle',
      badge: null,
      gradient: ['#FFB84A', '#FFC566'],
      onPress: () => {},
    },
  ] as const;

  // Анимации
  const scrollY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Загрузка достижений
  useEffect(() => {
    console.log('🎭 Состояние модального окна:', achievementModalVisible);
    console.log('🏆 Выбранное достижение:', selectedAchievement?.achievement.title);
  }, [achievementModalVisible, selectedAchievement]);

  // Отладка достижений
  useEffect(() => {
    console.log('🎯 Состояние достижений изменилось:', { 
      loadingAchievements, 
      achievementsCount: achievements.length,
      achievements: achievements.slice(0, 2) // Показываем только первые 2 для краткости
    });
  }, [loadingAchievements, achievements]);

  // Загрузка достижений при монтировании
  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    loadAchievements();
  }, []);

  // Parallax effects
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 150],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const floatingTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const loadAchievements = async () => {
    if (isGuest) return;

    try {
      setLoadingAchievements(true);
      console.log('🎯 Начинаем загрузку достижений...');
      const data = await achievementsApi.getUserAchievements();
      console.log('✅ Достижения загружены:', data?.length || 0, 'элементов');
      setAchievements(data);
    } catch (error) {
      console.error('❌ Ошибка загрузки достижений:', error);
    } finally {
      setLoadingAchievements(false);
    }
  };

  const handleAchievementPress = (achievement: AchievementProgress) => {
    console.log('🎯 Нажатие на достижение:', achievement.achievement.title);
    console.log('📊 Achievement data:', achievement);
    setSelectedAchievement(achievement);
    setAchievementModalVisible(true);
  };

  const handleAcceptChallenge = async () => {
    if (!selectedAchievement) return;

    try {
      await achievementsApi.acceptChallenge(selectedAchievement.achievement.id);
      await loadAchievements(); // Перезагрузить достижения
      setAchievementModalVisible(false);
      Alert.alert('Успех', 'Вы приняли вызов!');
    } catch (error) {
      console.error('Ошибка принятия вызова:', error);
      Alert.alert('Ошибка', 'Не удалось принять вызов');
    }
  };

  const handleSaveProfile = () => {
    updateUser({ name: editName });
    setIsEditing(false);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || 'Максим');
    setIsEditing(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Background with Parallax */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 300],
                    outputRange: [0, -100],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <ImageBackground
            source={require('@/assets/images/profile_background.jpg')}
            style={StyleSheet.absoluteFill}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={
                isDark
                  ? [
                      'rgba(11, 13, 18, 0.7)',
                      'rgba(11, 13, 18, 0.85)',
                      'rgba(11, 13, 18, 0.95)',
                    ]
                  : [
                      'rgba(242, 242, 242, 0.3)',
                      'rgba(242, 242, 242, 0.6)',
                      'rgba(242, 242, 242, 0.85)',
                    ]
              }
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>
        </Animated.View>

        <StatusBar style={isDark ? 'light' : 'dark'} />

        <SafeAreaView style={styles.safeArea}>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={styles.scrollContent}
            style={{ backgroundColor: 'transparent' }}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={16}
          >
            {/* Floating Header Actions */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.headerButton}
              >
                <BlurView
                  intensity={80}
                  tint={isDark ? 'dark' : 'light'}
                  style={styles.headerButtonBlur}
                >
                  <Ionicons name="share-outline" size={20} color={colors.text1} />
                </BlurView>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.headerButton}
              >
                <BlurView
                  intensity={80}
                  tint={isDark ? 'dark' : 'light'}
                  style={styles.headerButtonBlur}
                >
                  <Ionicons name="qr-code-outline" size={20} color={colors.text1} />
                </BlurView>
              </TouchableOpacity>
            </Animated.View>

          {/* УЛУЧШЕННАЯ ПРОФИЛЬНАЯ КАРТОЧКА */}
          <GlassCard style={styles.profileCard} borderRadius="ultra">
            {/* Верхний декоративный градиент */}
            <View style={styles.profileCardHeader}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(255,184,74,0.2)', 'rgba(255,184,74,0.05)', 'transparent']
                  : ['rgba(255,184,74,0.3)', 'rgba(255,184,74,0.1)', 'transparent']
                }
                style={styles.headerGradient}
              />
            </View>

            {/* Основной контент профиля */}
            <View style={styles.profileContent}>
              {/* Аватар и основная информация */}
              <View style={styles.profileMain}>
                {/* Центрированный аватар */}
                <Animated.View style={[styles.avatarWrapper, { transform: [{ scale: scaleAnim }] }]}>
                  <LinearGradient
                    colors={[colors.accent, colors.accent2]}
                    style={styles.avatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.avatarText}>
                      {user?.name?.[0]?.toUpperCase() || 'М'}
                    </Text>
                  </LinearGradient>
                  {/* Verified Badge */}
                  <View style={styles.verifiedBadge}>
                    <LinearGradient
                      colors={['#13EF85', '#0ACB6F']}
                      style={StyleSheet.absoluteFill}
                    />
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  </View>
                </Animated.View>

                {/* Имя и редактирование */}
                <View style={styles.nameSection}>
                  {isEditing ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={[
                          styles.nameInput,
                          {
                            color: colors.text1,
                            backgroundColor: colors.glassBg,
                            borderColor: colors.accent,
                          },
                        ]}
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Введите имя"
                        placeholderTextColor={colors.text3}
                        autoFocus
                      />
                      <View style={styles.editActions}>
                        <TouchableOpacity
                          onPress={handleSaveProfile}
                          style={[styles.editBtn, { backgroundColor: colors.accent }]}
                        >
                          <Ionicons name="checkmark" size={18} color="#2B1F05" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleCancelEdit}
                          style={[styles.editBtn, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
                        >
                          <Ionicons name="close" size={18} color={colors.text2} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={styles.nameRow}>
                        <Text
                          style={[
                            styles.userName,
                            { color: colors.text1, fontFamily: Typography.unbounded },
                          ]}
                        >
                          {user?.name || 'Максим'}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setIsEditing(true)}
                          style={[styles.editIcon, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
                        >
                          <Feather name="edit-2" size={14} color={colors.text2} />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          styles.userRole,
                          { color: colors.text2, fontFamily: Typography.interMedium },
                        ]}
                      >
                        {isGuest ? 'Гостевой режим' : 'Путешественник'}
                      </Text>
                    </>
                  )}
                </View>

                {/* Бейджи */}
                <View style={styles.badgesRow}>
                  <View
                    style={[
                      styles.locationBadge,
                      { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
                    ]}
                  >
                    <Ionicons name="location" size={14} color={colors.accent} />
                    <Text style={[styles.badgeText, { color: colors.text2, fontFamily: Typography.interMedium }]}>
                      Москва
                    </Text>
                  </View>
                  {!isGuest && (
                    <View
                      style={[
                        styles.premiumBadge,
                        { 
                          backgroundColor: colors.accent + '20',
                          borderColor: colors.accent,
                        },
                      ]}
                    >
                      <Ionicons name="sparkles" size={14} color={colors.accent} />
                      <Text style={[styles.badgeText, { color: colors.accent, fontFamily: Typography.interSemiBold }]}>
                        Премиум
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Разделитель */}
              <View style={[styles.divider, { backgroundColor: colors.glassBorder }]} />

              {/* Статистика в Grid Layout */}
              <View style={styles.statsSection}>
                <Text
                  style={[
                    styles.statsSectionTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  Статистика
                </Text>
                <View style={styles.statsGrid}>
                  {/* Левая колонка */}
                  <View style={styles.statsColumn}>
                    {STATS.slice(0, 2).map((stat) => (
                      <GlassCard
                        key={stat.label}
                        style={styles.statCard}
                        borderRadius="xl"
                      >
                        <LinearGradient
                          colors={stat.gradient}
                          style={styles.statIconBox}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name={stat.icon as any} size={22} color="#FFF" />
                        </LinearGradient>
                        <View style={styles.statInfo}>
                          <Text
                            style={[
                              styles.statValue,
                              { color: colors.text1, fontFamily: Typography.interBold },
                            ]}
                          >
                            {stat.value}
                          </Text>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: colors.text2, fontFamily: Typography.interMedium },
                            ]}
                          >
                            {stat.label}
                          </Text>
                        </View>
                      </GlassCard>
                    ))}
                  </View>
                  {/* Правая колонка */}
                  <View style={styles.statsColumn}>
                    {STATS.slice(2, 4).map((stat) => (
                      <GlassCard
                        key={stat.label}
                        style={styles.statCard}
                        borderRadius="xl"
                      >
                        <LinearGradient
                          colors={stat.gradient}
                          style={styles.statIconBox}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name={stat.icon as any} size={22} color="#FFF" />
                        </LinearGradient>
                        <View style={styles.statInfo}>
                          <Text
                            style={[
                              styles.statValue,
                              { color: colors.text1, fontFamily: Typography.interBold },
                            ]}
                          >
                            {stat.value}
                          </Text>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: colors.text2, fontFamily: Typography.interMedium },
                            ]}
                          >
                            {stat.label}
                          </Text>
                        </View>
                      </GlassCard>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Достижения */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { 
                  color: 'rgba(255, 255, 255, 0.98)', 
                  fontFamily: 'Unbounded_700Bold',
                  fontSize: Typography.h3,
                },
              ]}
            >
              Достижения
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsScroll}
            >
              {loadingAchievements ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.accent} />
                  <Text style={[styles.loadingText, { color: colors.text2 }]}>
                    Загрузка достижений...
                  </Text>
                </View>
              ) : achievements.length > 0 ? (
                achievements.map((achievementProgress) => {
                  const achievement = achievementProgress.achievement;
                  const userAchievement = achievementProgress.user_achievement;
                  const isCompleted = userAchievement?.is_completed || false;
                  const isAccepted = userAchievement?.is_accepted || false;

                  return (
                    <TouchableOpacity
                      key={achievement.id}
                      style={styles.optionWrapper}
                      activeOpacity={0.7}
                      onPress={() => handleAchievementPress(achievementProgress)}
                    >
                      <View
                        style={[
                          styles.achievementCard,
                          {
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            borderColor: isCompleted ? '#FFB84A' : 'rgba(255, 255, 255, 0.35)',
                            opacity: isCompleted ? 1 : 0.5,
                          },
                        ]}
                      >
                        <Text style={[styles.achievementIcon, { color: 'rgba(255, 255, 255, 0.98)' }]}>
                          {achievement.icon}
                        </Text>
                        <Text
                          style={[
                            styles.achievementTitle,
                            { color: 'rgba(255, 255, 255, 0.98)' },
                          ]}
                        >
                          {achievement.title}
                        </Text>
                        {isCompleted && (
                          <View style={styles.achievementCheck}>
                            <Ionicons name="checkmark" size={10} color="#2B1F05" />
                          </View>
                        )}
                        {!isCompleted && isAccepted && (
                          <View style={styles.achievementChallenge}>
                            <Text style={styles.challengeText}>
                              {Math.round(achievementProgress.progress_percentage)}%
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="trophy-outline" size={48} color={colors.text3} />
                  <Text style={[styles.emptyText, { color: colors.text3 }]}>
                    Достижения появятся по мере использования приложения
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Быстрые настройки */}
          <GlassCard style={styles.settingsCard} borderRadius="xxl">
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text1, fontFamily: Typography.unbounded },
              ]}
            >
              Быстрые настройки
            </Text>
            <View style={styles.quickSettings}>
              {QUICK_SETTINGS.map((setting) => {
                let switchValue = false;
                let onToggle = () => {};

                if (setting.id === 'theme') {
                  switchValue = isDark;
                  onToggle = toggleTheme;
                }
                if (setting.id === 'notifications') {
                  switchValue = notificationsEnabled;
                  onToggle = () => setNotificationsEnabled((prev) => !prev);
                }
                if (setting.id === 'location') {
                  switchValue = locationEnabled;
                  onToggle = () => setLocationEnabled((prev) => !prev);
                }

                return (
                  <View
                    key={setting.id}
                    style={[
                      styles.settingRow,
                      { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIconBox, { backgroundColor: colors.accent + '15' }]}>
                        <Ionicons
                          name={
                            (setting.id === 'theme'
                              ? isDark ? setting.icon : setting.iconLight
                              : setting.icon) as any
                          }
                          size={18}
                          color={colors.accent}
                        />
                      </View>
                      <Text
                        style={[
                          styles.settingLabel,
                          { color: colors.text1, fontFamily: Typography.interSemiBold },
                        ]}
                      >
                        {setting.label}
                      </Text>
                    </View>
                    <Switch
                      value={switchValue}
                      onValueChange={onToggle}
                      trackColor={{ false: colors.glassBg, true: colors.accent }}
                      thumbColor="#FFF"
                      ios_backgroundColor={colors.glassBg}
                    />
                  </View>
                );
              })}
            </View>
          </GlassCard>

          {/* Меню */}
          <GlassCard style={styles.menuCard} borderRadius="xxl">
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={item.onPress}
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
                    borderBottomColor: colors.glassBorder,
                  },
                ]}
              >
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: colors.glassBg }]}>
                    <Ionicons name={item.icon as any} size={20} color={colors.text1} />
                  </View>
                  <Text
                    style={[
                      styles.menuLabel,
                      { color: colors.text1, fontFamily: Typography.interMedium },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={[styles.menuBadge, { backgroundColor: colors.accent }]}>
                      <Text style={[styles.menuBadgeText, { fontFamily: Typography.interBold }]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={colors.text3} />
                </View>
              </TouchableOpacity>
            ))}
          </GlassCard>

          {/* Кнопка выхода */}
          <Button
            title={isGuest ? 'Войти' : 'Выйти'}
            variant="outline"
            onPress={logout}
            style={styles.logoutButton}
            textStyle={{ fontFamily: Typography.interSemiBold }}
            icon={
              <Ionicons
                name={isGuest ? 'log-in-outline' : 'log-out-outline'}
                size={18}
                color={colors.accent}
              />
            }
          />

          <Text
            style={[
              styles.version,
              { color: colors.text3, fontFamily: Typography.interMedium },
            ]}
          >
            Версия 1.0.0
          </Text>
        </Animated.ScrollView>

        {/* Фон для области под нижним меню */}
        <View style={styles.bottomAreaBackground} />
      </SafeAreaView>
    </View>

    {/* Модальное окно достижения - вынесено за пределы ImageBackground */}
    <Modal
      visible={achievementModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setAchievementModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <GlassCard style={styles.modalContent} borderRadius="ultra">
          {selectedAchievement && (
            <>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text1 }]}>
                  {selectedAchievement.achievement.icon} {selectedAchievement.achievement.title}
                </Text>
                <TouchableOpacity
                  onPress={() => setAchievementModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={colors.text2} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={[styles.modalDescription, { color: colors.text1 }]}>
                  {selectedAchievement.achievement.description}
                </Text>

                <View style={styles.achievementStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.text2 }]}>Условие</Text>
                    <Text style={[styles.statValue, { color: colors.text1 }]}>
                      {selectedAchievement.achievement.condition_type === 'routes_count' && `Создать ${selectedAchievement.achievement.condition_value} маршрутов`}
                      {selectedAchievement.achievement.condition_type === 'places_count' && `Посетить ${selectedAchievement.achievement.condition_value} мест`}
                      {selectedAchievement.achievement.condition_type === 'active_days' && `Быть активным ${selectedAchievement.achievement.condition_value} дней подряд`}
                      {selectedAchievement.achievement.condition_type === 'travel_days' && `Путешествовать ${selectedAchievement.achievement.condition_value} дней`}
                      {selectedAchievement.achievement.condition_type === 'favorites_count' && `Добавить ${selectedAchievement.achievement.condition_value} мест в избранное`}
                      {selectedAchievement.achievement.condition_type === 'total_points' && `Набрать ${selectedAchievement.achievement.condition_value} очков`}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.text2 }]}>Награда</Text>
                    <Text style={[styles.statValue, { color: colors.accent }]}>
                      {selectedAchievement.achievement.reward_points} очков
                    </Text>
                  </View>

                  {selectedAchievement.user_achievement && (
                    <View style={styles.statItem}>
                      <Text style={[styles.statLabel, { color: colors.text2 }]}>Прогресс</Text>
                      <Text style={[styles.statValue, { color: colors.text1 }]}>
                        {selectedAchievement.user_achievement.current_progress} / {selectedAchievement.achievement.condition_value}
                        ({Math.round(selectedAchievement.progress_percentage)}%)
                      </Text>
                    </View>
                  )}
                </View>

                {!selectedAchievement.user_achievement?.is_completed && selectedAchievement.can_accept_challenge && (
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarBg, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${selectedAchievement.progress_percentage}%`,
                            backgroundColor: colors.accent,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                {selectedAchievement.user_achievement?.is_completed ? (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color="#FFB84A" />
                    <Text style={[styles.completedText, { color: colors.text1 }]}>
                      Достижение выполнено!
                    </Text>
                  </View>
                ) : selectedAchievement.can_accept_challenge ? (
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleAcceptChallenge}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.acceptButtonText}>
                      🎯 Принять вызов
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.lockedText}>
                      Достижение заблокировано
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </GlassCard>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  historyCard: {
    marginTop: Spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyList: {
    gap: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  historyItemContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  historyItemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: Layout.screenGutter,
    paddingTop: Spacing.md,
    paddingBottom: Layout.dockOffset + 400,
    gap: Spacing.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // УЛУЧШЕННАЯ ПРОФИЛЬНАЯ КАРТОЧКА
  profileCard: {
    overflow: 'hidden',
    padding: 0,
  },
  profileCardHeader: {
    height: 100,
    position: 'relative',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  profileContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  
  // Основная секция профиля
  profileMain: {
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: -50, // Поднимаем аватар
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    color: '#2B1F05',
    fontFamily: Typography.interExtraBold,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    overflow: 'hidden',
  },

  // Секция имени
  nameSection: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userName: {
    fontSize: Typography.h2,
    letterSpacing: 0.3,
  },
  userRole: {
    fontSize: Typography.body,
    opacity: 0.8,
  },
  editIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainer: {
    width: '100%',
    gap: Spacing.md,
    alignItems: 'center',
  },
  nameInput: {
    fontSize: Typography.h3,
    fontFamily: Typography.interSemiBold,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    textAlign: 'center',
    minWidth: '80%',
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  // Бейджи
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: Typography.small,
  },

  // Разделитель
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.3,
  },

  // Секция статистики
  statsSection: {
    gap: Spacing.lg,
  },
  statsSectionTitle: {
    fontSize: Typography.h4,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
    justifyContent: 'space-between',
  },
  statsColumn: {
    flex: 1,
    gap: Spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statInfo: {
    gap: 2,
    flex: 1,
  },
  statValue: {
    fontSize: Typography.h3,
    lineHeight: Typography.h3 * 1.1,
  },
  statLabel: {
    fontSize: Typography.caption,
  },

  // Достижения
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h4,
    paddingHorizontal: Spacing.xs,
  },
  achievementsScroll: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
    paddingRight: 150, // Добавлено для плавного ухода элементов за экран
  },
  achievementCard: {
    width: 120,
    height: 100,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Unbounded_400Regular',
  },
  achievementCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB84A',
  },

  // Настройки
  settingsCard: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  quickSettings: {
    gap: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: Typography.body,
  },

  // Меню
  menuCard: {
    padding: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: Typography.body,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  menuBadgeText: {
    fontSize: Typography.small,
    color: '#2B1F05',
  },

  // Кнопки
  logoutButton: {
    marginTop: Spacing.md,
  },
  version: {
    fontSize: Typography.small,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },

  // Новые стили для достижений
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: Typography.body,
    marginTop: Spacing.sm,
  },
  optionWrapper: {
    marginRight: Spacing.md,
  },
  achievementChallenge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500',
  },
  challengeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2B1F05',
  },

  // Модальное окно достижения
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    flex: 1,
    marginRight: Spacing.md,
  },
  modalCloseButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalBody: {
    maxHeight: 300,
  },
  modalDescription: {
    fontSize: Typography.body,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  achievementStats: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  progressBarContainer: {
    marginTop: Spacing.lg,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalFooter: {
    marginTop: Spacing.xl,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: 'rgba(255, 184, 74, 0.1)',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: '#FFB84A',
  },
  completedText: {
    fontSize: Typography.body,
    fontWeight: '600',
  },
  acceptButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  acceptButtonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#2B1F05',
    fontSize: Typography.body,
    fontWeight: 'bold',
  },
  acceptedBadge: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  acceptedText: {
    fontSize: Typography.small,
    textAlign: 'center',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.lg,
  },
  lockedText: {
    fontSize: Typography.body,
    color: 'rgba(255,255,255,0.5)',
  },
  bottomSpacer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(11, 13, 18, 0.95)',
  },
  bottomAreaBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(11, 13, 18, 0.95)',
  },
});
