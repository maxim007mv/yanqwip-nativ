import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFriendsStore } from '@/store/friendsStore';
import type { Friend, FriendCategory } from '@/lib/types';
import { Colors, Typography, Spacing } from '@/lib/theme';

interface FriendCategoriesListProps {
  onProfilePress?: (userId: string) => void;
}

export const FriendCategoriesList: React.FC<FriendCategoriesListProps> = ({
  onProfilePress,
}) => {
  const {
    friends,
    loading,
    setFriendCategory,
    getFriendsByCategory,
  } = useFriendsStore();

  const [selectedCategory, setSelectedCategory] = useState<FriendCategory | 'all'>('all');
  const [categoryFriends, setCategoryFriends] = useState<Friend[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const categories: Array<{ value: FriendCategory | 'all', label: string, icon: string, color: string }> = [
    { value: 'all', label: 'Все друзья', icon: 'people', color: Colors.dark.accent },
    { value: 'close', label: 'Близкие друзья', icon: 'heart', color: '#FF6B9D' },
    { value: 'acquaintance', label: 'Знакомые', icon: 'person', color: '#4ECDC4' },
    { value: 'hiking_partner', label: 'Попутчики', icon: 'map', color: '#A78BFA' },
    { value: 'none', label: 'Без категории', icon: 'help-circle', color: '#FFB84A' },
  ];

  useEffect(() => {
    loadCategoryFriends();
  }, [selectedCategory]);

  const loadCategoryFriends = async () => {
    if (selectedCategory === 'all') {
      setCategoryFriends(friends);
      return;
    }

    setLoadingCategory(true);
    try {
      const friendsInCategory = await getFriendsByCategory(selectedCategory);
      setCategoryFriends(friendsInCategory);
    } catch (error) {
      console.error('Error loading category friends:', error);
      setCategoryFriends([]);
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleCategoryChange = async (friendId: string, newCategory: FriendCategory) => {
    try {
      await setFriendCategory(friendId, newCategory);
      // Refresh the current category
      loadCategoryFriends();
      Alert.alert('Успешно', 'Категория друга обновлена');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить категорию');
    }
  };

  const renderCategoryTab = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.value && styles.categoryTabActive,
      ]}
      onPress={() => setSelectedCategory(item.value)}
    >
      <Ionicons
        name={item.icon as any}
        size={16}
        color={selectedCategory === item.value ? item.color : Colors.dark.text3}
      />
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === item.value && styles.categoryTabTextActive,
          { color: selectedCategory === item.value ? item.color : Colors.dark.text3 },
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
      {item.value !== 'all' && (
        <View style={[styles.categoryBadge, { backgroundColor: item.color }]}>
          <Text style={styles.categoryBadgeText}>
            {friends.filter(f => f.category === item.value).length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <BlurView intensity={60} tint="dark" style={styles.friendItem}>
      <TouchableOpacity
        style={styles.friendInfo}
        onPress={() => onProfilePress?.(item.id)}
      >
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
        ) : (
          <View style={[styles.friendAvatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={20} color={Colors.dark.text2} />
          </View>
        )}
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendUsername}>@{item.username}</Text>
          {item.city && (
            <Text style={styles.friendCity}>
              <Ionicons name="location-outline" size={12} color={Colors.dark.text3} /> {item.city}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => {
          // Show category selection modal or picker
          Alert.alert(
            'Изменить категорию',
            `Выберите категорию для ${item.name}`,
            categories
              .filter(cat => cat.value !== 'all')
              .map(cat => ({
                text: cat.label,
                onPress: () => handleCategoryChange(item.id, cat.value as FriendCategory),
                style: (item.category === cat.value ? 'destructive' : 'default') as any,
              }))
              .concat([{ text: 'Отмена', style: 'cancel' as any, onPress: async () => {} }])
          );
        }}
      >
        <Ionicons
          name={categories.find(cat => cat.value === item.category)?.icon as any || 'people'}
          size={16}
          color={categories.find(cat => cat.value === item.category)?.color || Colors.dark.text3}
        />
        <Text style={styles.categoryButtonText}>
          {categories.find(cat => cat.value === item.category)?.label || 'Без категории'}
        </Text>
      </TouchableOpacity>
    </BlurView>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={48} color={Colors.dark.text3} />
      <Text style={styles.emptyText}>
        {selectedCategory === 'all' ? 'Нет друзей' : 'Нет друзей в этой категории'}
      </Text>
      <Text style={styles.emptySubtext}>
        {selectedCategory === 'all'
          ? 'Начните добавлять друзей через поиск'
          : 'Друзья в этой категории появятся здесь'
        }
      </Text>
    </View>
  );

  if (loading.friends) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <Text style={styles.loadingText}>Загрузка друзей...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <FlatList
        data={categories}
        renderItem={renderCategoryTab}
        keyExtractor={item => item.value}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Friends List */}
      {loadingCategory ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.accent} />
          <Text style={styles.loadingText}>Загрузка категории...</Text>
        </View>
      ) : (
        <FlatList
          data={categoryFriends}
          renderItem={renderFriend}
          keyExtractor={item => item.id}
          contentContainerStyle={categoryFriends.length > 0 ? styles.listContent : styles.emptyListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.xs,
    minWidth: 100,
    maxWidth: 140,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(255, 184, 74, 0.1)',
    borderColor: 'rgba(255, 184, 74, 0.3)',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
  categoryTabTextActive: {
    fontWeight: '600',
  },
  categoryBadge: {
    minWidth: 20,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: Colors.dark.text1,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    marginBottom: 2,
  },
  friendCity: {
    fontSize: 11,
    color: Colors.dark.text3,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: Spacing.xs,
  },
  categoryButtonText: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: Spacing.xl,
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
});