import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFriendsStore } from '@/store/friendsStore';
import type { FriendCategory } from '@/lib/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/theme';

interface FriendCategoriesModalProps {
  visible: boolean;
  onClose: () => void;
}

interface CategoryInfo {
  key: FriendCategory;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const categories: CategoryInfo[] = [
  {
    key: 'close',
    label: 'Близкие друзья',
    description: 'Друзья, с которыми вы часто общаетесь и ходите в походы',
    icon: 'heart',
    color: Colors.dark.error,
  },
  {
    key: 'acquaintance',
    label: 'Знакомые',
    description: 'Люди, которых вы знаете, но не так близко',
    icon: 'people',
    color: Colors.dark.warning,
  },
  {
    key: 'hiking_partner',
    label: 'Партнеры по походам',
    description: 'Друзья, с которыми вы предпочитаете ходить в походы',
    icon: 'map',
    color: Colors.dark.success,
  },
  {
    key: 'none',
    label: 'Без категории',
    description: 'Друзья без специальной категории',
    icon: 'remove-circle',
    color: Colors.dark.text3,
  },
];

export const FriendCategoriesModal: React.FC<FriendCategoriesModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    friends,
    setFriendCategory,
  } = useFriendsStore();

  const [selectedCategory, setSelectedCategory] = useState<FriendCategory | null>(null);

  const friendsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof friends> = {};
    friends.forEach(friend => {
      const category = friend.category || 'none';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(friend);
    });
    return grouped;
  }, [friends]);

  const handleCategoryChange = async (friendId: string, category: FriendCategory) => {
    try {
      await setFriendCategory(friendId, category);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось изменить категорию друга');
    }
  };

  const renderCategoryCard = (category: CategoryInfo) => {
    const friendsInCategory = friendsByCategory[category.key] || [];
    const isSelected = selectedCategory === category.key;

    return (
      <TouchableOpacity
        key={category.key}
        style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
        onPress={() => setSelectedCategory(isSelected ? null : category.key)}
      >
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            <Ionicons name={category.icon} size={24} color={Colors.dark.text1} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{category.label}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </View>
          <View style={styles.categoryStats}>
            <Text style={styles.categoryCount}>{friendsInCategory.length}</Text>
            <Ionicons
              name={isSelected ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.dark.text3}
            />
          </View>
        </View>

        {isSelected && (
          <View style={styles.categoryFriends}>
            {friendsInCategory.length === 0 ? (
              <Text style={styles.noFriendsText}>Нет друзей в этой категории</Text>
            ) : (
              friendsInCategory.map(friend => (
                <View key={friend.id} style={styles.friendItem}>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendUsername}>@{friend.username}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.changeCategoryButton}
                    onPress={() => {
                      Alert.alert(
                        `Изменить категорию для ${friend.name}`,
                        'Выберите новую категорию',
                        [
                          ...categories.map(cat => ({
                            text: cat.label,
                            onPress: () => handleCategoryChange(friend.id, cat.key),
                          })),
                          { text: 'Отмена', style: 'cancel' },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="create" size={16} color={Colors.dark.accent} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text1} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Категории друзей</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.categoriesList}>
            {categories.map(renderCategoryCard)}
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  categoriesList: {
    gap: Spacing.md,
    paddingTop: Spacing.lg,
  },
  categoryCard: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    overflow: 'hidden',
  },
  categoryCardSelected: {
    borderColor: Colors.dark.accent,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryCount: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.dark.accent,
  },
  categoryFriends: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.glassBorder,
    padding: Spacing.md,
  },
  noFriendsText: {
    fontSize: Typography.body,
    color: Colors.dark.text3,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '500',
  },
  friendUsername: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
  },
  changeCategoryButton: {
    padding: Spacing.sm,
  },
});