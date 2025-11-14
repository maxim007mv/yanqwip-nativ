import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFriendsStore } from '@/store/friendsStore';
import type { Friend, FriendActivity, SharedTrip, FriendStats, FriendReliability, FriendLocation } from '@/lib/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/theme';

interface FriendProfileModalProps {
  visible: boolean;
  friendId: string | null;
  onClose: () => void;
}

type TabType = 'profile' | 'activity' | 'trips' | 'location';

export const FriendProfileModal: React.FC<FriendProfileModalProps> = ({
  visible,
  friendId,
  onClose,
}) => {
  const {
    selectedFriend,
    friendActivity,
    friendStats,
    friendReliability,
    friendLocation,
    sharedTrips,
    loading,
    loadFriendDetails,
    loadFriendActivity,
    loadFriendLocation,
    loadSharedTrips,
    setFriendCategory,
    removeFriend,
    blockUser,
  } = useFriendsStore();

  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    if (visible && friendId) {
      loadFriendDetails(friendId);
      setActiveTab('profile');
    }
  }, [visible, friendId]);

  useEffect(() => {
    if (visible && friendId && activeTab === 'activity') {
      loadFriendActivity(friendId);
    } else if (visible && friendId && activeTab === 'trips') {
      loadSharedTrips(friendId);
    } else if (visible && friendId && activeTab === 'location') {
      loadFriendLocation(friendId);
    }
  }, [activeTab, visible, friendId]);

  const handleCategoryChange = async (category: 'close' | 'acquaintance' | 'hiking_partner' | 'none') => {
    if (!friendId) return;
    try {
      await setFriendCategory(friendId, category);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleRemoveFriend = async () => {
    if (!friendId) return;
    try {
      await removeFriend(friendId);
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  const handleBlockUser = async () => {
    if (!friendId) return;
    try {
      await blockUser(friendId);
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={Colors.dark.accent}
        />
      );
    }
    return stars;
  };

  const renderActivityItem = ({ item }: { item: FriendActivity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons
          name={
            item.type === 'route_completed' ? 'map' :
            item.type === 'achievement_earned' ? 'trophy' :
            item.type === 'place_visited' ? 'location' :
            'chatbubble'
          }
          size={20}
          color={Colors.dark.accent}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityDate}>
          {new Date(item.timestamp).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  const renderTripItem = ({ item }: { item: SharedTrip }) => (
    <View style={styles.tripItem}>
      <View style={styles.tripHeader}>
        <Text style={styles.tripTitle}>{item.routeTitle}</Text>
        <View style={styles.tripStats}>
          <Text style={styles.tripStat}>
            <Ionicons name="map" size={14} color={Colors.dark.text3} /> {item.distance} км
          </Text>
          <Text style={styles.tripStat}>
            <Ionicons name="time" size={14} color={Colors.dark.text3} /> {Math.round(item.duration / 60)} ч
          </Text>
        </View>
      </View>
      <Text style={styles.tripDate}>
        {new Date(item.completedAt).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
      {item.rating && (
        <View style={styles.tripRating}>
          {renderStars(item.rating)}
        </View>
      )}
    </View>
  );

  const tabs: Array<{ key: TabType; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { key: 'profile', label: 'Профиль', icon: 'person' },
    { key: 'activity', label: 'Активность', icon: 'pulse' },
    { key: 'trips', label: 'Походы', icon: 'map' },
    { key: 'location', label: 'Локация', icon: 'location' },
  ];

  if (!selectedFriend) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text1} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Профиль друга</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleRemoveFriend} style={styles.headerAction}>
              <Ionicons name="person-remove" size={20} color={Colors.dark.error} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBlockUser} style={styles.headerAction}>
              <Ionicons name="ban" size={20} color={Colors.dark.error} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {selectedFriend.avatar ? (
                <Image source={{ uri: selectedFriend.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={40} color={Colors.dark.text2} />
                </View>
              )}
              {friendLocation?.isSharing && (
                <View style={styles.onlineIndicator}>
                  <Ionicons name="location" size={12} color={Colors.dark.success} />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{selectedFriend.name}</Text>
              <Text style={styles.username}>@{selectedFriend.username}</Text>
              {selectedFriend.city && (
                <View style={styles.cityContainer}>
                  <Ionicons name="location" size={14} color={Colors.dark.text3} />
                  <Text style={styles.city}>{selectedFriend.city}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Category Selector */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Категория</Text>
            <View style={styles.categoryButtons}>
              {[
                { key: 'close', label: 'Близкий друг', icon: 'heart' },
                { key: 'acquaintance', label: 'Знакомый', icon: 'people' },
                { key: 'hiking_partner', label: 'Партнер по походам', icon: 'map' },
                { key: 'none', label: 'Без категории', icon: 'remove-circle' },
              ].map(category => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    selectedFriend.category === category.key && styles.categoryButtonActive,
                  ]}
                  onPress={() => handleCategoryChange(category.key as any)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={selectedFriend.category === category.key ? Colors.dark.text1 : Colors.dark.text3}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedFriend.category === category.key && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={activeTab === tab.key ? Colors.dark.accent : Colors.dark.text3}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <View style={styles.tabContent}>
              {/* Stats */}
              {friendStats && (
                <View style={styles.statsSection}>
                  <Text style={styles.sectionTitle}>Статистика</Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{friendStats.totalRoutes}</Text>
                      <Text style={styles.statLabel}>Маршрутов</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{friendStats.completedRoutes}</Text>
                      <Text style={styles.statLabel}>Завершено</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{friendStats.totalDistance}км</Text>
                      <Text style={styles.statLabel}>Расстояние</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{friendStats.hikingDays}</Text>
                      <Text style={styles.statLabel}>Дней походов</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Reliability */}
              {friendReliability && (
                <View style={styles.reliabilitySection}>
                  <Text style={styles.sectionTitle}>Надежность</Text>
                  <View style={styles.reliabilityGrid}>
                    <View style={styles.reliabilityItem}>
                      <View style={styles.reliabilityHeader}>
                        <Text style={styles.reliabilityLabel}>Общий рейтинг</Text>
                        <View style={styles.starsContainer}>
                          {renderStars(friendReliability.rating)}
                        </View>
                      </View>
                      <Text style={styles.reliabilityValue}>{friendReliability.rating}/5</Text>
                    </View>
                    <View style={styles.reliabilityItem}>
                      <Text style={styles.reliabilityLabel}>Пунктуальность</Text>
                      <Text style={styles.reliabilityValue}>{friendReliability.punctuality}/5</Text>
                    </View>
                    <View style={styles.reliabilityItem}>
                      <Text style={styles.reliabilityLabel}>Опыт</Text>
                      <Text style={styles.reliabilityValue}>{friendReliability.experience}/5</Text>
                    </View>
                    <View style={styles.reliabilityItem}>
                      <Text style={styles.reliabilityLabel}>Отзывы</Text>
                      <Text style={styles.reliabilityValue}>{friendReliability.reviewsCount}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Interests */}
              {selectedFriend.interests && selectedFriend.interests.length > 0 && (
                <View style={styles.interestsSection}>
                  <Text style={styles.sectionTitle}>Интересы</Text>
                  <View style={styles.interestsContainer}>
                    {selectedFriend.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'activity' && (
            <View style={styles.tabContent}>
              {loading.friendDetails ? (
                <ActivityIndicator size="large" color={Colors.dark.accent} />
              ) : friendActivity.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="pulse-outline" size={48} color={Colors.dark.text3} />
                  <Text style={styles.emptyText}>Нет активности</Text>
                </View>
              ) : (
                <FlatList
                  data={friendActivity}
                  renderItem={renderActivityItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}

          {activeTab === 'trips' && (
            <View style={styles.tabContent}>
              {loading.friendDetails ? (
                <ActivityIndicator size="large" color={Colors.dark.accent} />
              ) : sharedTrips.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="map-outline" size={48} color={Colors.dark.text3} />
                  <Text style={styles.emptyText}>Нет совместных походов</Text>
                </View>
              ) : (
                <FlatList
                  data={sharedTrips}
                  renderItem={renderTripItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}

          {activeTab === 'location' && (
            <View style={styles.tabContent}>
              {loading.location ? (
                <ActivityIndicator size="large" color={Colors.dark.accent} />
              ) : friendLocation?.isSharing ? (
                <View style={styles.locationContainer}>
                  <View style={styles.locationHeader}>
                    <Ionicons name="location" size={24} color={Colors.dark.success} />
                    <Text style={styles.locationTitle}>Друг делится локацией</Text>
                  </View>
                  <Text style={styles.locationText}>
                    Последнее обновление: {new Date(friendLocation.timestamp).toLocaleString('ru-RU')}
                  </Text>
                  <Text style={styles.locationCoords}>
                    {friendLocation.latitude.toFixed(4)}, {friendLocation.longitude.toFixed(4)}
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="location-outline" size={48} color={Colors.dark.text3} />
                  <Text style={styles.emptyText}>Локация скрыта</Text>
                  <Text style={styles.emptySubtext}>Друг не делится своим местоположением</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.glassBorder,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerAction: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.success,
  },
  profileInfo: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  name: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.dark.text1,
    marginBottom: Spacing.xs,
  },
  username: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
    marginBottom: Spacing.sm,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    marginLeft: Spacing.xs,
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
    marginBottom: Spacing.md,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  categoryButtonActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  categoryButtonText: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    marginLeft: Spacing.xs,
  },
  categoryButtonTextActive: {
    color: Colors.dark.text1,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.dark.accent,
  },
  tabText: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.dark.text1,
  },
  tabContent: {
    flex: 1,
  },
  statsSection: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  statValue: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.dark.accent,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    textAlign: 'center',
  },
  reliabilitySection: {
    marginBottom: Spacing.lg,
  },
  reliabilityGrid: {
    gap: Spacing.md,
  },
  reliabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  reliabilityHeader: {
    flex: 1,
  },
  reliabilityLabel: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    marginBottom: Spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reliabilityValue: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.dark.accent,
  },
  interestsSection: {
    marginBottom: Spacing.lg,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.dark.accent,
    borderRadius: BorderRadius.sm,
  },
  interestText: {
    fontSize: Typography.caption,
    color: Colors.dark.text1,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    marginBottom: Spacing.xs,
  },
  activityDate: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
  },
  tripItem: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  tripTitle: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.md,
  },
  tripStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  tripStat: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
  },
  tripDate: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    marginBottom: Spacing.sm,
  },
  tripRating: {
    flexDirection: 'row',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.h3,
    color: Colors.dark.text2,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.body,
    color: Colors.dark.text3,
    textAlign: 'center',
  },
  locationContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationTitle: {
    fontSize: Typography.h4,
    color: Colors.dark.success,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  locationText: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    marginBottom: Spacing.sm,
  },
  locationCoords: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    fontFamily: 'monospace',
  },
});
