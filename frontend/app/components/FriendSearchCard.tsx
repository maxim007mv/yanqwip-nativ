import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  Modal,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useFriendsStore } from '@/store/friendsStore';
import type { Friend, SearchFilters } from '@/lib/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';

interface FriendSearchCardProps {
  onClose?: () => void;
}

const ACTIVITY_LEVELS: Array<{value: 'low' | 'medium' | 'high', label: string}> = [
  { value: 'low', label: 'Низкая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'high', label: 'Высокая' },
];

export const FriendSearchCard: React.FC<FriendSearchCardProps> = ({ onClose }) => {
  const {
    searchFriends,
    searchResults,
    loading,
    sendFriendRequest,
    searchFilters,
    setSearchFilters,
    clearSearchFilters,
  } = useFriendsStore();

  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(searchFilters);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);
  const [friendMessage, setFriendMessage] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = useCallback(() => {
    const filters: SearchFilters = {
      ...localFilters,
      query: query.trim() || undefined,
    };
    searchFriends(filters);
  }, [query, localFilters, searchFriends]);

  const handleAddFriend = (user: Friend) => {
    setSelectedUser(user);
    setFriendMessage('');
    setShowMessageModal(true);
  };

  const handleSendFriendRequest = async () => {
    if (!selectedUser) return;

    try {
      await sendFriendRequest(selectedUser.id, friendMessage.trim() || undefined);
      setShowMessageModal(false);
      setSelectedUser(null);
      setFriendMessage('');
    } catch (error) {
      // Ошибка обрабатывается в сторе
    }
  };

  const applyFilters = () => {
    setSearchFilters(localFilters);
    setShowFilters(false);
    handleSearch();
  };

  const resetFilters = () => {
    setLocalFilters({});
    clearSearchFilters();
    setShowFilters(false);
  };

  const toggleActivityLevel = (level: 'low' | 'medium' | 'high') => {
    setLocalFilters({ 
      ...localFilters, 
      activityLevel: localFilters.activityLevel === level ? undefined : level 
    });
  };

  const renderUserItem = ({ item }: { item: Friend }) => (
    <BlurView intensity={60} tint="dark" style={styles.userItem}>
      <View style={styles.userInfo}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color={Colors.dark.text2} />
          </View>
        )}
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
          {item.city && (
            <Text style={styles.userCity}>
              <Ionicons name="location-outline" size={12} color={Colors.dark.text3} /> {item.city}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          (item.status === 'pending_sent' || item.status === 'pending_received') && styles.addButtonDisabled,
        ]}
        onPress={() => handleAddFriend(item)}
        disabled={item.status === 'pending_sent' || item.status === 'pending_received' || item.status === 'friend'}
      >
        <Ionicons
          name={
            item.status === 'friend'
              ? 'checkmark-circle'
              : item.status === 'pending_sent' || item.status === 'pending_received'
              ? 'time-outline'
              : 'person-add'
          }
          size={20}
          color={Colors.dark.text1}
        />
      </TouchableOpacity>
    </BlurView>
  );

  return (
    <BlurView intensity={80} tint="dark" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Поиск друзей</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.dark.text1} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.dark.text2}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Имя, email или ID..."
          placeholderTextColor={Colors.dark.text3}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        >
          <Ionicons
            name={showFilters ? 'options' : 'options-outline'}
            size={20}
            color={Colors.dark.accent}
          />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <BlurView intensity={60} tint="dark" style={styles.filtersPanel}>
          {/* City Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Город</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Москва"
              placeholderTextColor={Colors.dark.text3}
              value={localFilters.city || ''}
              onChangeText={city => setLocalFilters({ ...localFilters, city })}
            />
          </View>

          {/* Interests Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Интересы</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Культура, история..."
              placeholderTextColor={Colors.dark.text3}
              value={localFilters.interests?.join(', ') || ''}
              onChangeText={text =>
                setLocalFilters({
                  ...localFilters,
                  interests: text.split(',').map(i => i.trim()).filter(Boolean),
                })
              }
            />
          </View>

          {/* Activity Level Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Активность</Text>
            <View style={styles.activityButtons}>
              {ACTIVITY_LEVELS.map(level => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.activityButton,
                    localFilters.activityLevel === level.value &&
                      styles.activityButtonActive,
                  ]}
                  onPress={() => toggleActivityLevel(level.value)}
                >
                  <Text
                    style={[
                      styles.activityButtonText,
                      localFilters.activityLevel === level.value &&
                        styles.activityButtonTextActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filter Actions */}
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Сбросить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading.search ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.accent} />
            <Text style={styles.loadingText}>Поиск...</Text>
          </View>
        ) : searchResults.length === 0 && query.trim().length > 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.dark.text3} />
            <Text style={styles.emptyText}>Ничего не найдено</Text>
            <Text style={styles.emptySubtext}>
              Попробуйте изменить запрос или фильтры
            </Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>

      {/* Message Modal */}
      <Modal
        visible={showMessageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={80} tint="dark" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Отправить заявку в друзья</Text>
              <TouchableOpacity
                onPress={() => setShowMessageModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.dark.text1} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <View style={styles.selectedUserInfo}>
                <View style={styles.selectedUserDetails}>
                  {selectedUser.avatar ? (
                    <Image source={{ uri: selectedUser.avatar }} style={styles.selectedUserAvatar} />
                  ) : (
                    <View style={[styles.selectedUserAvatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={20} color={Colors.dark.text2} />
                    </View>
                  )}
                  <View>
                    <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
                    <Text style={styles.selectedUserUsername}>@{selectedUser.username}</Text>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.messageLabel}>Персональное сообщение (необязательно)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Расскажите, почему вы хотите добавить этого человека в друзья..."
              placeholderTextColor={Colors.dark.text3}
              value={friendMessage}
              onChangeText={setFriendMessage}
              multiline
              numberOfLines={4}
              maxLength={200}
              autoFocus
            />
            <Text style={styles.messageHint}>
              {friendMessage.length}/200 символов
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowMessageModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.sendModalButton]}
                onPress={handleSendFriendRequest}
              >
                <Ionicons name="send" size={16} color={Colors.dark.text1} />
                <Text style={styles.sendModalButtonText}>Отправить заявку</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.dark.text1,
    paddingVertical: Spacing.md,
  },
  filterButton: {
    padding: Spacing.xs,
  },
  filtersPanel: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterRow: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  filterInput: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  activityButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  activityButtonActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  activityButtonText: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
  },
  activityButtonTextActive: {
    color: Colors.dark.text1,
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
  },
  applyButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  userItem: {
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
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
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    marginBottom: 2,
  },
  userCity: {
    fontSize: 11,
    color: Colors.dark.text3,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 184, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  selectedUserInfo: {
    marginBottom: Spacing.lg,
  },
  selectedUserDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.md,
  },
  selectedUserName: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedUserUsername: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
  },
  messageLabel: {
    fontSize: Typography.caption,
    color: Colors.dark.text2,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  messageInput: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  messageHint: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    textAlign: 'right',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cancelModalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelModalButtonText: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
  },
  sendModalButton: {
    backgroundColor: Colors.dark.accent,
  },
  sendModalButtonText: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: '600',
  },
});
