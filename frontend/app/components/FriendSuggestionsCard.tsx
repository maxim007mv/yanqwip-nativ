import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useFriendsStore } from '@/store/friendsStore';
import type { FriendSuggestion } from '@/lib/types';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';

type SuggestionTab = 'contacts' | 'nearby' | 'interests';

export const FriendSuggestionsCard: React.FC = () => {
  const {
    suggestions,
    loading,
    syncContacts,
    findNearby,
    loadMutualInterests,
    sendFriendRequest,
    permissions,
    requestContactsPermission,
    requestLocationPermission,
  } = useFriendsStore();

  const [activeTab, setActiveTab] = useState<SuggestionTab>('interests');

  useEffect(() => {
    // Автоматически загружаем предложения на основе интересов
    loadMutualInterests();
  }, []);

  const handleTabChange = async (tab: SuggestionTab) => {
    setActiveTab(tab);

    switch (tab) {
      case 'contacts':
        if (permissions.contacts === null) {
          const granted = await requestContactsPermission();
          if (granted) {
            syncContacts();
          }
        } else if (permissions.contacts) {
          if (suggestions.contacts.length === 0) {
            syncContacts();
          }
        }
        break;
      case 'nearby':
        if (permissions.location === null) {
          const granted = await requestLocationPermission();
          if (granted) {
            findNearby();
          }
        } else if (permissions.location) {
          if (suggestions.nearby.length === 0) {
            findNearby();
          }
        }
        break;
      case 'interests':
        if (suggestions.interests.length === 0) {
          loadMutualInterests();
        }
        break;
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
    } catch (error) {
      // Ошибка обрабатывается в сторе
    }
  };

  const getSourceIcon = (source: FriendSuggestion['source']) => {
    switch (source) {
      case 'contacts':
        return 'people-outline';
      case 'nearby':
        return 'location-outline';
      case 'interests':
        return 'heart-outline';
      case 'mutual_friends':
        return 'people-circle-outline';
      default:
        return 'person-outline';
    }
  };

  const getSourceLabel = (source: FriendSuggestion['source']) => {
    switch (source) {
      case 'contacts':
        return 'Из контактов';
      case 'nearby':
        return 'Поблизости';
      case 'interests':
        return 'Общие интересы';
      case 'mutual_friends':
        return 'Общие друзья';
      default:
        return '';
    }
  };

  const renderSuggestionItem = ({ item }: { item: FriendSuggestion }) => (
    <BlurView intensity={60} tint="dark" style={styles.suggestionItem}>
      <View style={styles.suggestionInfo}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={28} color={Colors.dark.text2} />
          </View>
        )}
        <View style={styles.suggestionDetails}>
          <Text style={styles.suggestionName}>{item.name}</Text>
          <Text style={styles.suggestionUsername}>@{item.username}</Text>
          
          <View style={styles.suggestionMeta}>
            <Ionicons
              name={getSourceIcon(item.source)}
              size={12}
              color={Colors.dark.accent}
            />
            <Text style={styles.suggestionSource}>
              {getSourceLabel(item.source)}
            </Text>
            
            {item.matchScore !== undefined && (
              <>
                <View style={styles.metaDivider} />
                <Text style={styles.suggestionMatch}>
                  {Math.round(item.matchScore * 100)}% совпадение
                </Text>
              </>
            )}
            
            {item.distanceKm !== undefined && (
              <>
                <View style={styles.metaDivider} />
                <Text style={styles.suggestionDistance}>
                  {item.distanceKm < 1
                    ? `${Math.round(item.distanceKm * 1000)} м`
                    : `${item.distanceKm.toFixed(1)} км`}
                </Text>
              </>
            )}
          </View>

          {item.commonRoutes !== undefined && item.commonRoutes > 0 && (
            <Text style={styles.commonRoutes} numberOfLines={1}>
              Общих маршрутов: {item.commonRoutes}
            </Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddFriend(item.id)}
      >
        <Ionicons name="person-add" size={20} color={Colors.dark.text1} />
      </TouchableOpacity>
    </BlurView>
  );

  const getCurrentSuggestions = () => {
    switch (activeTab) {
      case 'contacts':
        return suggestions.contacts;
      case 'nearby':
        return suggestions.nearby;
      case 'interests':
        return suggestions.interests;
      default:
        return [];
    }
  };

  const isLoading = () => {
    switch (activeTab) {
      case 'contacts':
        return loading.sync;
      case 'nearby':
        return loading.nearby;
      case 'interests':
        return loading.interests;
      default:
        return false;
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'contacts':
        return permissions.contacts === false
          ? 'Нет доступа к контактам'
          : 'Нет пользователей из ваших контактов';
      case 'nearby':
        return permissions.location === false
          ? 'Нет доступа к геолокации'
          : 'Рядом нет пользователей';
      case 'interests':
        return 'Нет предложений на основе интересов';
      default:
        return 'Нет предложений';
    }
  };

  const currentSuggestions = getCurrentSuggestions();
  const currentLoading = isLoading();

  return (
    <BlurView intensity={80} tint="dark" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Предложения</Text>
        <Text style={styles.subtitle}>Найдите новых друзей</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'interests' && styles.tabActive]}
          onPress={() => handleTabChange('interests')}
        >
          <Ionicons
            name="heart"
            size={20}
            color={activeTab === 'interests' ? Colors.dark.accent : Colors.dark.text3}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'interests' && styles.tabTextActive,
            ]}
          >
            Интересы
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'nearby' && styles.tabActive]}
          onPress={() => handleTabChange('nearby')}
        >
          <Ionicons
            name="location"
            size={20}
            color={activeTab === 'nearby' ? Colors.dark.accent : Colors.dark.text3}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'nearby' && styles.tabTextActive,
            ]}
          >
            Рядом
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'contacts' && styles.tabActive]}
          onPress={() => handleTabChange('contacts')}
        >
          <Ionicons
            name="people"
            size={20}
            color={activeTab === 'contacts' ? Colors.dark.accent : Colors.dark.text3}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'contacts' && styles.tabTextActive,
            ]}
          >
            Контакты
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.accent} />
            <Text style={styles.loadingText}>Загрузка...</Text>
          </View>
        ) : currentSuggestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.dark.text3} />
            <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
          </View>
        ) : (
          <FlatList
            data={currentSuggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 184, 74, 0.15)',
    borderColor: Colors.dark.accent,
  },
  tabText: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
  },
  tabTextActive: {
    color: Colors.dark.accent,
    fontWeight: Typography.semiBold,
  },
  content: {
    minHeight: 250,
  },
  listContent: {
    paddingBottom: Spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  suggestionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionDetails: {
    flex: 1,
  },
  suggestionName: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: Typography.semiBold,
    marginBottom: 2,
  },
  suggestionUsername: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    marginBottom: Spacing.xs,
  },
  suggestionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  suggestionSource: {
    fontSize: 11,
    color: Colors.dark.accent,
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.dark.text3,
  },
  suggestionMatch: {
    fontSize: 11,
    color: Colors.dark.text3,
  },
  suggestionDistance: {
    fontSize: 11,
    color: Colors.dark.text3,
  },
  commonRoutes: {
    fontSize: 11,
    color: Colors.dark.text3,
    fontStyle: 'italic',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 184, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.accent,
    marginLeft: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  loadingText: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
