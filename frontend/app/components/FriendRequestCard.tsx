import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useFriendsStore } from '@/store/friendsStore';
import type { FriendRequest } from '@/lib/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/theme';

interface FriendRequestCardProps {
  request: FriendRequest;
  type: 'incoming' | 'outgoing';
  onProfilePress?: (userId: string) => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
  onProfilePress,
}) => {
  const { acceptRequest, rejectRequest, rejectAndBlock } = useFriendsStore();
  const [loading, setLoading] = useState(false);

  const user = type === 'incoming' ? request.from : request.to;
  const isIncoming = type === 'incoming';
  const isPending = request.status === 'pending';

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptRequest(request.id);
      Alert.alert('Успешно', `${user.name} добавлен в друзья`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось принять заявку');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'Отклонить заявку',
      `Вы уверены, что хотите отклонить заявку от ${user.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отклонить',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await rejectRequest(request.id);
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отклонить заявку');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBlock = async () => {
    Alert.alert(
      'Заблокировать пользователя',
      `Вы действительно хотите заблокировать ${user.name}? Этот пользователь не сможет отправлять вам заявки в друзья.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Заблокировать',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await rejectAndBlock(request.id);
              Alert.alert('Успешно', 'Пользователь заблокирован');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось заблокировать пользователя');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дн. назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onProfilePress?.(user.id)}
      activeOpacity={0.7}
      disabled={loading}
    >
      <BlurView intensity={15} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={28} color={Colors.dark.text3} />
              </View>
            )}
            {isPending && isIncoming && (
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.info}>
            <View style={styles.header}>
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
              {user.city && (
                <View style={styles.cityBadge}>
                  <Ionicons name="location" size={12} color={Colors.dark.text3} />
                  <Text style={styles.cityText}>{user.city}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.username} numberOfLines={1}>
              @{user.username}
            </Text>

            {request.message && (
              <View style={styles.messageContainer}>
                <Ionicons name="chatbubble-outline" size={14} color={Colors.dark.text3} />
                <Text style={styles.messageText} numberOfLines={2}>
                  {request.message}
                </Text>
              </View>
            )}

            <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
          </View>

          {/* Actions */}
          {isIncoming && isPending && (
            <View style={styles.actions}>
              {loading ? (
                <ActivityIndicator size="small" color={Colors.dark.accent} />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleAccept}
                  >
                    <Ionicons name="checkmark" size={22} color={Colors.dark.accent} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleReject}
                  >
                    <Ionicons name="close" size={22} color={Colors.dark.text2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleBlock}
                  >
                    <Ionicons name="ban" size={20} color={Colors.dark.error} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {!isPending && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {request.status === 'accepted' && 'Принято'}
                {request.status === 'rejected' && 'Отклонено'}
                {request.status === 'blocked' && 'Заблокировано'}
              </Text>
            </View>
          )}

          {isIncoming === false && isPending && (
            <View style={styles.statusBadge}>
              <Ionicons name="time-outline" size={16} color={Colors.dark.text3} />
              <Text style={styles.statusText}>Ожидает</Text>
            </View>
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  content: {
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.dark.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.accent,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text1,
    fontFamily: Typography.interSemiBold,
    marginRight: Spacing.sm,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cityText: {
    fontSize: 11,
    color: Colors.dark.text3,
    marginLeft: 2,
  },
  username: {
    fontSize: 14,
    color: Colors.dark.text3,
    marginBottom: 6,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    color: Colors.dark.text2,
    marginLeft: 6,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: Colors.dark.text3,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.backgroundSecondary,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: Colors.dark.text3,
    fontWeight: '500',
  },
});
