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
import { BlurView } from 'expo-blur';

import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Маршрутов', value: 12, icon: 'map', color: '#FF6B9D' },
  { label: 'Мест', value: 38, icon: 'location', color: '#4ECDC4' },
  { label: 'Дней', value: 45, icon: 'calendar', color: '#FFB84A' },
  { label: 'Км', value: 156, icon: 'walk', color: '#A78BFA' },
];

const ACHIEVEMENTS = [
  { id: 1, icon: '🏆', title: 'Первый маршрут', unlocked: true },
  { id: 2, icon: '⭐', title: '10 мест', unlocked: true },
  { id: 3, icon: '🎯', title: 'Неделя активности', unlocked: false },
  { id: 4, icon: '🔥', title: 'Месяц в путешествиях', unlocked: false },
];

const QUICK_SETTINGS = [
  {
    id: 'theme',
    label: 'Тёмная тема',
    icon: 'moon',
    iconLight: 'sunny',
    type: 'switch',
  },
  {
    id: 'notifications',
    label: 'Уведомления',
    icon: 'notifications',
    type: 'switch',
  },
  {
    id: 'location',
    label: 'Геолокация',
    icon: 'location',
    type: 'switch',
  },
] as const;

const MENU_ITEMS = [
  {
    id: 'favorites',
    label: 'Избранное',
    icon: 'heart',
    badge: '12',
  },
  {
    id: 'history',
    label: 'История',
    icon: 'time',
    badge: null,
  },
  {
    id: 'settings',
    label: 'Настройки',
    icon: 'settings',
    badge: null,
  },
  {
    id: 'help',
    label: 'Помощь',
    icon: 'help-circle',
    badge: null,
  },
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
    
    // Micro-interaction animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.headerButton,
                { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
              ]}
            >
              <Ionicons name="share-outline" size={20} color={colors.text1} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.headerButton,
                { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
              ]}
            >
              <Ionicons name="qr-code-outline" size={20} color={colors.text1} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <GlassCard style={styles.profileCard} borderRadius="xxl">
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(255,184,74,0.15)', 'transparent']
                  : ['rgba(255,184,74,0.25)', 'transparent']
              }
              style={styles.profileCardGradient}
            />
            
            <View style={styles.profileHeader}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <LinearGradient
                  colors={[colors.accent, colors.accent2]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {user?.name?.[0]?.toUpperCase() || 'М'}
                  </Text>
                  <View style={styles.avatarBadge}>
                    <Ionicons name="checkmark" size={14} color="#2B1F05" />
                  </View>
                </LinearGradient>
              </Animated.View>

              <View style={styles.profileInfo}>
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
                        style={[styles.editButton, { backgroundColor: colors.accent }]}
                      >
                        <Ionicons name="checkmark" size={18} color="#2B1F05" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleCancelEdit}
                        style={[
                          styles.editButton,
                          { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
                        ]}
                      >
                        <Ionicons name="close" size={18} color={colors.text2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        styles.name,
                        { color: colors.text1, fontFamily: Typography.unbounded },
                      ]}
                    >
                      {user?.name || 'Максим'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsEditing(true)}
                      style={[
                        styles.iconButton,
                        { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
                      ]}
                    >
                      <Feather name="edit-2" size={14} color={colors.text2} />
                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={styles.badges}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
                    ]}
                  >
                    <Ionicons name="location" size={12} color={colors.accent} />
                    <Text
                      style={[
                        styles.badgeText,
                        { color: colors.text2, fontFamily: Typography.interMedium },
                      ]}
                    >
                      Москва
                    </Text>
                  </View>
                  {!isGuest && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: colors.accent + '20', borderColor: colors.accent },
                      ]}
                    >
                      <Ionicons name="sparkles" size={12} color={colors.accent} />
                      <Text
                        style={[
                          styles.badgeText,
                          { color: colors.accent, fontFamily: Typography.interSemiBold },
                        ]}
                      >
                        Премиум
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Stats Grid - Bento Grid Style */}
            <View style={styles.statsGrid}>
              {STATS.map((stat, index) => (
                <View
                  key={stat.label}
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: colors.glassBg,
                      borderColor: colors.glassBorder,
                    },
                    index === 0 && styles.statCardLarge,
                  ]}
                >
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: stat.color + '15' },
                    ]}
                  >
                    <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                  </View>
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
              ))}
            </View>
          </GlassCard>

          {/* Achievements */}
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
                      borderColor: achievement.unlocked
                        ? colors.accent
                        : colors.glassBorder,
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

          {/* Quick Settings */}
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
                      {
                        backgroundColor: colors.glassBg,
                        borderColor: colors.glassBorder,
                      },
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View
                        style={[
                          styles.settingIconBox,
                          { backgroundColor: colors.accent + '15' },
                        ]}
                      >
                        <Ionicons
                          name={
                            (setting.id === 'theme'
                              ? isDark
                                ? setting.icon
                                : setting.iconLight
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
                      trackColor={{
                        false: colors.glassBg,
                        true: colors.accent,
                      }}
                      thumbColor="#FFF"
                      ios_backgroundColor={colors.glassBg}
                    />
                  </View>
                );
              })}
            </View>
          </GlassCard>

          {/* Menu Items */}
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
                  <View
                    style={[
                      styles.menuIconBox,
                      { backgroundColor: colors.glassBg },
                    ]}
                  >
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
                      <Text
                        style={[
                          styles.menuBadgeText,
                          { fontFamily: Typography.interBold },
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={colors.text3} />
                </View>
              </TouchableOpacity>
            ))}
          </GlassCard>

          {/* Logout Button */}
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
    gap: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Card
  profileCard: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    overflow: 'hidden',
  },
  profileCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 32,
    color: '#2B1F05',
    fontFamily: Typography.interExtraBold,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#13EF85',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  name: {
    fontSize: Typography.h3,
    letterSpacing: 0.2,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainer: {
    gap: Spacing.sm,
  },
  nameInput: {
    fontSize: Typography.h4,
    fontFamily: Typography.interSemiBold,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: Typography.small,
  },

  // Stats Grid - Bento Grid Style
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: (width - Layout.screenGutter * 2 - Spacing.xl * 2 - Spacing.md) / 2,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  statCardLarge: {
    minWidth: '100%',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.h2,
    lineHeight: Typography.h2 * 1.1,
  },
  statLabel: {
    fontSize: Typography.caption,
  },

  // Achievements
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

  // Settings Card
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

  // Menu Card
  menuCard: {
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
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
    gap: Spacing.sm,
  },
  menuBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  menuBadgeText: {
    fontSize: Typography.tiny,
    color: '#2B1F05',
  },

  // Logout
  logoutButton: {
    marginTop: Spacing.sm,
  },
  version: {
    fontSize: Typography.small,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
