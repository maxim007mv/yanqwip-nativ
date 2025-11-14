import { apiClient } from './client';
import type {
  Friend,
  FriendRequest,
  SearchFilters,
  FriendSuggestion,
  NearbyParams,
  ContactSync,
  FriendCategory,
  FriendActivity,
  FriendLocation,
  SharedTrip,
  FriendStats,
  FriendReliability,
} from '@/lib/types';

// Экспортируем типы для обратной совместимости
export type {
  Friend,
  FriendRequest,
  SearchFilters,
  FriendSuggestion,
  NearbyParams,
  ContactSync,
  FriendCategory,
  FriendActivity,
  FriendLocation,
  SharedTrip,
  FriendStats,
  FriendReliability,
};

export const friendsApi = {
  /**
   * Поиск пользователей по имени, email или ID
   */
  search: async (filters: SearchFilters): Promise<Friend[]> => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.city) params.append('city', filters.city);
    if (filters.activityLevel) params.append('activity_level', filters.activityLevel);
    if (filters.hasCommonRoutes) params.append('has_common_routes', 'true');
    if (filters.interests?.length) {
      filters.interests.forEach(interest => params.append('interests', interest));
    }

    const { data } = await apiClient.get<Friend[]>(`/friends/search?${params.toString()}`);
    return data;
  },

  /**
   * Поиск пользователя по уникальному ID
   */
  findById: async (userId: string): Promise<Friend> => {
    const { data } = await apiClient.get<Friend>(`/friends/by-id/${userId}`);
    return data;
  },

  /**
   * Получить данные пользователя по QR-коду
   */
  scanQR: async (qrData: string): Promise<Friend> => {
    const { data } = await apiClient.post<Friend>('/friends/scan-qr', { qr_data: qrData });
    return data;
  },

  /**
   * Синхронизация с контактами телефона
   */
  syncContacts: async (contacts: ContactSync): Promise<FriendSuggestion[]> => {
    const { data } = await apiClient.post<FriendSuggestion[]>('/friends/sync-contacts', contacts);
    return data;
  },

  /**
   * Поиск пользователей поблизости
   */
  getNearby: async (params: NearbyParams): Promise<FriendSuggestion[]> => {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lng: params.lng.toString(),
      radius: (params.radius || 5).toString(),
    });

    const { data } = await apiClient.get<FriendSuggestion[]>(`/friends/nearby?${queryParams.toString()}`);
    return data;
  },

  /**
   * Получить предложения на основе общих интересов и маршрутов
   */
  getMutualInterests: async (): Promise<FriendSuggestion[]> => {
    const { data } = await apiClient.get<FriendSuggestion[]>('/friends/mutual-interests');
    return data;
  },

  /**
   * Получить список друзей
   */
  getFriends: async (): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>('/friends');
    return data;
  },

  /**
   * Получить список входящих запросов в друзья
   */
  getIncomingRequests: async (): Promise<FriendRequest[]> => {
    const { data } = await apiClient.get<FriendRequest[]>('/friends/requests/incoming');
    return data;
  },

  /**
   * Получить список исходящих запросов в друзья
   */
  getOutgoingRequests: async (): Promise<FriendRequest[]> => {
    const { data } = await apiClient.get<FriendRequest[]>('/friends/requests/outgoing');
    return data;
  },

  /**
   * Отправить запрос в друзья с персональным сообщением
   */
  sendRequest: async (userId: string, message?: string): Promise<FriendRequest> => {
    const { data } = await apiClient.post<FriendRequest>('/friends/request', { 
      user_id: userId,
      message,
    });
    return data;
  },

  /**
   * Принять запрос в друзья
   */
  acceptRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/friends/request/${requestId}/accept`);
  },

  /**
   * Отклонить запрос в друзья
   */
  rejectRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/friends/request/${requestId}/reject`);
  },

  /**
   * Отклонить и заблокировать пользователя
   */
  rejectAndBlock: async (requestId: string): Promise<void> => {
    await apiClient.post(`/friends/request/${requestId}/reject-and-block`);
  },

  /**
   * Удалить из друзей
   */
  removeFriend: async (userId: string): Promise<void> => {
    await apiClient.delete(`/friends/${userId}`);
  },

  /**
   * Заблокировать пользователя
   */
  blockUser: async (userId: string): Promise<void> => {
    await apiClient.post(`/friends/${userId}/block`);
  },

  /**
   * Разблокировать пользователя
   */
  unblockUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/friends/${userId}/block`);
  },

  /**
   * Получить QR-код текущего пользователя
   */
  getMyQR: async (): Promise<{ qrData: string; qrImage: string }> => {
    const { data } = await apiClient.get<{ qrData: string; qrImage: string }>('/friends/my-qr');
    return data;
  },

  /**
   * Управление категориями друзей
   */
  setFriendCategory: async (userId: string, category: FriendCategory): Promise<void> => {
    await apiClient.put(`/friends/${userId}/category`, { category });
  },

  /**
   * Получить активность друга
   */
  getFriendActivity: async (userId: string, limit: number = 20): Promise<FriendActivity[]> => {
    const { data } = await apiClient.get<FriendActivity[]>(`/friends/${userId}/activity?limit=${limit}`);
    return data;
  },

  /**
   * Получить статистику друга
   */
  getFriendStats: async (userId: string): Promise<FriendStats> => {
    const { data } = await apiClient.get<FriendStats>(`/friends/${userId}/stats`);
    return data;
  },

  /**
   * Получить рейтинг надежности друга
   */
  getFriendReliability: async (userId: string): Promise<FriendReliability> => {
    const { data } = await apiClient.get<FriendReliability>(`/friends/${userId}/reliability`);
    return data;
  },

  /**
   * Получить текущую локацию друга (если разрешено)
   */
  getFriendLocation: async (userId: string): Promise<FriendLocation | null> => {
    try {
      const { data } = await apiClient.get<FriendLocation>(`/friends/${userId}/location`);
      return data;
    } catch (error) {
      return null; // Пользователь не делится локацией
    }
  },

  /**
   * Включить/выключить шаринг локации
   */
  toggleLocationSharing: async (enabled: boolean): Promise<void> => {
    await apiClient.put('/friends/settings/location-sharing', { enabled });
  },

  /**
   * Обновить свою текущую локацию
   */
  updateMyLocation: async (latitude: number, longitude: number, accuracy: number): Promise<void> => {
    await apiClient.post('/friends/my-location', { latitude, longitude, accuracy });
  },

  /**
   * Получить историю совместных походов с другом
   */
  getSharedTrips: async (userId: string): Promise<SharedTrip[]> => {
    const { data } = await apiClient.get<SharedTrip[]>(`/friends/${userId}/shared-trips`);
    return data;
  },

  /**
   * Получить список заблокированных пользователей
   */
  getBlockedUsers: async (): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>('/friends/blocked');
    return data;
  },

  /**
   * Получить список подписчиков
   */
  getFollowers: async (): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>('/friends/followers');
    return data;
  },

  /**
   * Получить список подписок
   */
  getFollowing: async (): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>('/friends/following');
    return data;
  },

  /**
   * Получить друзей по категории
   */
  getFriendsByCategory: async (category: FriendCategory): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>(`/friends/category/${category}`);
    return data;
  },
};

