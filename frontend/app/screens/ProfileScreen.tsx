// Profile Card Component - Улучшенная версия
import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';

import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Маршрутов', value: 12, icon: 'map', color: '#FF6B9D', gradient: ['#FF6B9D', '#FE8B99'] },
  { label: 'Мест', value: 38, icon: 'location', color: '#4ECDC4', gradient: ['#4ECDC4', '#44A9A9'] },
  { label: 'Дней', value: 45, icon: 'calendar', color: '#FFB84A', gradient: ['#FFB84A', '#FFC566'] },
  { label: 'Км', value: 156, icon: 'walk', color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6'] },
];

const ACHIEVEMENTS = [
  { id: 1, icon: '🏆', title: 'Первый маршрут', unlocked: true },
  { id: 2, icon: '⭐', title: '10 мест', unlocked: true },
  { id: 3, icon: '🎯', title: 'Неделя активности', unlocked: false },
  { id: 4, icon: '🔥', title: 'Месяц в путешествиях', unlocked: false },
];

const QUICK_SETTINGS = [
  { id: 'theme', label: 'Тёмная тема', icon: 'moon', iconLight: 'sunny', type: 'switch' },
  { id: 'notifications', label: 'Уведомления', icon: 'notifications', type: 'switch' },
  { id: 'location', label: 'Геолокация', icon: 'location', type: 'switch' },
] as const;

const MENU_ITEMS = [
  { id: 'favorites', label: 'Избранное', icon: 'heart', badge: '12' },
  { id: 'history', label: 'История', icon: 'time', badge: null },
  { id: 'settings', label: 'Настройки', icon: 'settings', badge: null },
  { id: 'help', label: 'Помощь', icon: 'help-circle', badge: null },
] as const;

export default function ProfileScreen() {
  const { theme, toggleTheme } = useUIStore();
  const { user, logout, updateUser, isGuest } = useAuthStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Максим');

  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    <ImageBackground
      source={require('@/assets/images/profile_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={isDark ? 12 : 8}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Actions */}
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.headerButton, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
            >
              <Ionicons name="share-outline" size={20} color={colors.text1} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.headerButton, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
            >
              <Ionicons name="qr-code-outline" size={20} color={colors.text1} />
            </TouchableOpacity>
          </View>

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
                      <View
                        key={stat.label}
                        style={[
                          styles.statCard,
                          {
                            backgroundColor: colors.glassBg,
                            borderColor: colors.glassBorder,
                          },
                        ]}
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
                      </View>
                    ))}
                  </View>
                  {/* Правая колонка */}
                  <View style={styles.statsColumn}>
                    {STATS.slice(2, 4).map((stat) => (
                      <View
                        key={stat.label}
                        style={[
                          styles.statCard,
                          {
                            backgroundColor: colors.glassBg,
                            borderColor: colors.glassBorder,
                          },
                        ]}
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
                      </View>
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
                { color: colors.text1, fontFamily: Typography.unbounded },
              ]}
            >
              Достижения
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsScroll}
            >
              {ACHIEVEMENTS.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    {
                      backgroundColor: colors.glassBg,
                      borderColor: achievement.unlocked ? colors.accent : colors.glassBorder,
                      opacity: achievement.unlocked ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text
                    style={[
                      styles.achievementTitle,
                      { color: colors.text1, fontFamily: Typography.interMedium },
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  {achievement.unlocked && (
                    <View style={[styles.achievementCheck, { backgroundColor: colors.accent }]}>
                      <Ionicons name="checkmark" size={10} color="#2B1F05" />
                    </View>
                  )}
                </View>
              ))}
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
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
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
  scrollContent: {
    paddingHorizontal: Layout.screenGutter,
    paddingTop: Spacing.md,
    paddingBottom: Layout.dockOffset + 140,
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
  },
  achievementCard: {
    width: 100,
    height: 120,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementTitle: {
    fontSize: Typography.small,
    textAlign: 'center',
  },
  achievementCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
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
});
