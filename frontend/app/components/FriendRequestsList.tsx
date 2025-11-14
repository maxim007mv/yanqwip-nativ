import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFriendsStore } from '@/store/friendsStore';
import { FriendRequestCard } from './FriendRequestCard';
import { Colors, Typography, Spacing } from '@/lib/theme';

interface FriendRequestsListProps {
  onProfilePress?: (userId: string) => void;
}

export const FriendRequestsList: React.FC<FriendRequestsListProps> = ({
  onProfilePress,
}) => {
  const {
    incomingRequests,
    outgoingRequests,
    loading,
    loadRequests,
  } = useFriendsStore();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const currentRequests = activeTab === 'incoming' ? incomingRequests : outgoingRequests;
  const hasRequests = currentRequests.length > 0;

  const renderRequest = ({ item }: { item: any }) => (
    <FriendRequestCard
      request={item}
      type={activeTab}
      onProfilePress={onProfilePress}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={activeTab === 'incoming' ? 'mail-outline' : 'send-outline'}
        size={48}
        color={Colors.dark.text3}
      />
      <Text style={styles.emptyText}>
        {activeTab === 'incoming'
          ? 'Нет входящих заявок'
          : 'Нет исходящих заявок'
        }
      </Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'incoming'
          ? 'Когда кто-то отправит вам заявку в друзья, она появится здесь'
          : 'Заявки, которые вы отправили, будут отображаться здесь'
        }
      </Text>
    </View>
  );

  if (loading.requests) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.accent} />
        <Text style={styles.loadingText}>Загрузка заявок...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'incoming' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('incoming')}
        >
          <Ionicons
            name="mail"
            size={16}
            color={activeTab === 'incoming' ? Colors.dark.accent : Colors.dark.text3}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'incoming' && styles.tabTextActive,
            ]}
            numberOfLines={1}
          >
            Входящие ({incomingRequests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'outgoing' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('outgoing')}
        >
          <Ionicons
            name="send"
            size={16}
            color={activeTab === 'outgoing' ? Colors.dark.accent : Colors.dark.text3}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'outgoing' && styles.tabTextActive,
            ]}
            numberOfLines={1}
          >
            Исходящие ({outgoingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <FlatList
        data={currentRequests}
        renderItem={renderRequest}
        keyExtractor={item => item.id}
        contentContainerStyle={hasRequests ? styles.listContent : styles.emptyListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    minWidth: 80,
    maxWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 184, 74, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 74, 0.3)',
  },
  tabText: {
    fontSize: 12,
    color: Colors.dark.text3,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'center',
  },
  tabTextActive: {
    color: Colors.dark.accent,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
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