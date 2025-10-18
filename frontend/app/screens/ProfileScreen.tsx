import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { ScreenShell } from '@/components/ScreenShell';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';

const STATS = [
  { label: 'Маршрутов', value: 12, icon: 'map-outline' },
  { label: 'Мест', value: 38, icon: 'location-outline' },
  { label: 'Дней', value: 45, icon: 'calendar-outline' },
  { label: 'Км', value: 156, icon: 'walk-outline' },
];

const SETTINGS_ROWS = [
  {
    id: 'theme',
    label: 'Тёмная тема',
    icon: 'moon',
    type: 'switch',
  },
  {
    id: 'notifications',
    label: 'Уведомления',
    icon: 'notifications-outline',
    type: 'switch',
  },
  {
    id: 'location',
    label: 'Геолокация',
    icon: 'location-outline',
    type: 'switch',
  },
  {
    id: 'language',
    label: 'Язык',
    icon: 'language-outline',
    type: 'link',
    value: 'Русский',
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

  const handleSaveProfile = () => {
    updateUser({ name: editName });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || 'Максим');
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View
          style={[
            styles.shellWrapper,
            { paddingBottom: Layout.dockOffset + Spacing.xl + 100 },
          ]}
        >
          <ScreenShell
            style={[styles.shell, { flex: 1 }]}
            contentStyle={styles.shellContent}
          >
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.topBar}>
                <View
                  style={[
                    styles.topChip,
                    { borderColor: colors.glassBorder, backgroundColor: colors.glassBg },
                  ]}
                >
                  <Ionicons name="sparkles" size={16} color={colors.accent} />
                  <Text
                    style={[
                      styles.topChipText,
                      { color: colors.text1, fontFamily: Typography.interSemiBold },
                    ]}
                  >
                    Премиум
                  </Text>
                </View>
                <View style={styles.topActions}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.iconButton,
                      { borderColor: colors.glassBorder, backgroundColor: colors.glassBg },
                    ]}
                  >
                    <Ionicons name="search" size={18} color={colors.text2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.iconButton,
                      { borderColor: colors.glassBorder, backgroundColor: colors.glassBg },
                    ]}
                  >
                    <Ionicons name="settings-outline" size={18} color={colors.text2} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.coverContainer}>
                <LinearGradient
                  colors={['rgba(255,184,74,0.28)', 'rgba(255,197,102,0.12)']}
                  style={styles.coverGradient}
                />
                <View style={styles.coverBadges}>
                  <View
                    style={[
                      styles.coverBadge,
                      { backgroundColor: colors.glassBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.coverBadgeText,
                        { color: colors.text1, fontFamily: Typography.interSemiBold },
                      ]}
                    >
                      Москва
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.coverBadge,
                      { backgroundColor: colors.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.coverBadgeText,
                        { color: '#2B1F05', fontFamily: Typography.interSemiBold },
                      ]}
                    >
                      Гид
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.profileHeader}>
                <LinearGradient
                  colors={[colors.accent, colors.accent2]}
                  style={styles.avatar}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { fontFamily: Typography.interExtraBold },
                    ]}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'М'}
                  </Text>
                </LinearGradient>
                <View style={styles.nameContainer}>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.nameInput,
                        { 
                          color: colors.text1, 
                          fontFamily: Typography.unbounded,
                          backgroundColor: colors.glassBg,
                          borderColor: colors.glassBorder,
                        },
                      ]}
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Введите имя"
                      placeholderTextColor={colors.text3}
                      autoFocus
                    />
                  ) : (
                    <Text
                      style={[
                        styles.name,
                        { color: colors.text1, fontFamily: Typography.unbounded },
                      ]}
                    >
                      {user?.name || 'Максим'}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    style={styles.editButton}
                  >
                    <Ionicons
                      name={isEditing ? 'checkmark' : 'pencil'}
                      size={20}
                      color={colors.accent}
                    />
                  </TouchableOpacity>
                  {isEditing && (
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      style={styles.cancelButton}
                    >
                      <Ionicons name="close" size={20} color={colors.text3} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text
                  style={[
                    styles.role,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  {isGuest ? 'Гостевой режим' : 'Путешественник'}
                </Text>
              </View>

              <GlassCard style={styles.statsCard} borderRadius="xxl">
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  Статистика
                </Text>
                <View style={styles.statsGrid}>
                  {STATS.map((stat) => (
                    <View
                      key={stat.label}
                      style={[
                        styles.statItem,
                        {
                          backgroundColor: colors.glassBg,
                          borderColor: colors.glassBorder,
                        },
                      ]}
                    >
                      <Ionicons name={stat.icon as any} size={24} color={colors.accent} />
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

              <GlassCard style={styles.settingsCard} borderRadius="xxl">
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  Настройки
                </Text>
                <View style={styles.settingsList}>
                  {SETTINGS_ROWS.map((row) => {
                    const isSwitch = row.type === 'switch';
                    let switchValue = false;
                    let onToggle = () => {};

                    if (row.id === 'theme') {
                      switchValue = isDark;
                      onToggle = toggleTheme;
                    }
                    if (row.id === 'notifications') {
                      switchValue = notificationsEnabled;
                      onToggle = () => setNotificationsEnabled((prev) => !prev);
                    }
                    if (row.id === 'location') {
                      switchValue = locationEnabled;
                      onToggle = () => setLocationEnabled((prev) => !prev);
                    }

                    return (
                      <View
                        key={row.id}
                        style={[
                          styles.settingRow,
                          {
                            backgroundColor: colors.glassBg,
                            borderColor: colors.glassBorder,
                          },
                        ]}
                      >
                        <View style={styles.settingLeft}>
                          <Ionicons
                            name={
                              row.id === 'theme'
                                ? isDark
                                  ? 'moon'
                                  : 'sunny'
                                : (row.icon as any)
                            }
                            size={20}
                            color={colors.text1}
                          />
                          <Text
                            style={[
                              styles.settingLabel,
                              { color: colors.text1, fontFamily: Typography.interSemiBold },
                            ]}
                          >
                            {row.label}
                          </Text>
                        </View>
                        {isSwitch ? (
                          <Switch
                            value={switchValue}
                            onValueChange={onToggle}
                            trackColor={{
                              false: colors.glassBg,
                              true: colors.accent,
                            }}
                            thumbColor="#FFF"
                          />
                        ) : (
                          <View style={styles.settingRight}>
                            <Text
                              style={[
                                styles.settingValue,
                                { color: colors.text3, fontFamily: Typography.interMedium },
                              ]}
                            >
                              {row.value}
                            </Text>
                            <Ionicons
                              name="chevron-forward"
                              size={18}
                              color={colors.text3}
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                <Button
                  title="Выйти"
                  variant="outline"
                  onPress={logout}
                  style={styles.logoutButton}
                  textStyle={{ fontFamily: Typography.interSemiBold }}
                />
              </GlassCard>
            </ScrollView>
          </ScreenShell>
        </View>
      </SafeAreaView>
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
    width: '100%',
    maxWidth: Layout.maxWidth,
  },
  shellContent: {
    paddingBottom: Spacing.jumbo,
  },
  scrollContent: {
    paddingBottom: Spacing.jumbo + 100,
    gap: Spacing.lg,
  },
  scrollView: {
    paddingBottom: Spacing.jumbo,
    gap: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  topChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  topChipText: {
    fontSize: Typography.caption,
    letterSpacing: 0.3,
  },
  topActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    height: 180,
    borderRadius: BorderRadius.ultra,
    overflow: 'hidden',
    position: 'relative',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  coverBadges: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  coverBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  coverBadgeText: {
    fontSize: Typography.small,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -48,
    gap: Spacing.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarText: {
    fontSize: 40,
    color: '#2B1F05',
  },
  name: {
    fontSize: Typography.h2,
    letterSpacing: 0.3,
  },
  role: {
    fontSize: Typography.body,
    opacity: 0.82,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    textShadowColor: 'rgba(255,184,74,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.h3,
  },
  statLabel: {
    fontSize: Typography.small,
  },
  settingsCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  settingsList: {
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
  settingLabel: {
    fontSize: Typography.body,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    fontSize: Typography.caption,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameInput: {
    fontSize: Typography.h2,
    letterSpacing: 0.3,
    minWidth: 200,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  editButton: {
    padding: Spacing.sm,
  },
  cancelButton: {
    padding: Spacing.sm,
  },
  logoutButton: {
    marginTop: Spacing.sm,
  },
});

