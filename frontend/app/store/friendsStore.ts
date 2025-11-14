import { create } from 'zustand';
import { friendsApi } from '@/api/friends';
import type {
  Friend,
  FriendRequest,
  FriendSuggestion,
  SearchFilters,
  NearbyParams,
  FriendCategory,
  FriendActivity,
  FriendLocation,
  SharedTrip,
  FriendStats,
  FriendReliability,
} from '@/lib/types';
import { Platform } from 'react-native';

interface FriendsState {
  // Списки
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  searchResults: Friend[];
  blockedUsers: Friend[];
  followers: Friend[];
  following: Friend[];
  suggestions: {
    contacts: FriendSuggestion[];
    nearby: FriendSuggestion[];
    interests: FriendSuggestion[];
  };

  // Детали друга
  selectedFriend: Friend | null;
  friendActivity: FriendActivity[];
  friendStats: FriendStats | null;
  friendReliability: FriendReliability | null;
  friendLocation: FriendLocation | null;
  sharedTrips: SharedTrip[];

  // Состояния загрузки
  loading: {
    friends: boolean;
    requests: boolean;
    search: boolean;
    sync: boolean;
    nearby: boolean;
    interests: boolean;
    friendDetails: boolean;
    location: boolean;
  };

  // Разрешения
  permissions: {
    contacts: boolean | null;
    location: boolean | null;
  };

  // Настройки
  locationSharingEnabled: boolean;

  // Фильтры поиска
  searchFilters: SearchFilters;

  // QR
  myQRCode: { qrData: string; qrImage: string } | null;

  // Ошибки
  error: string | null;

  // Actions - базовые
  loadFriends: () => Promise<void>;
  loadRequests: () => Promise<void>;
  searchFriends: (filters: SearchFilters) => Promise<void>;
  findById: (userId: string) => Promise<Friend | null>;
  sendFriendRequest: (userId: string, message?: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  rejectAndBlock: (requestId: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  
  // Категории
  setFriendCategory: (userId: string, category: FriendCategory) => Promise<void>;
  getFriendsByCategory: (category: FriendCategory) => Promise<Friend[]>;
  
  // Детали друга
  loadFriendDetails: (userId: string) => Promise<void>;
  loadFriendActivity: (userId: string, limit?: number) => Promise<void>;
  loadFriendLocation: (userId: string) => Promise<void>;
  loadSharedTrips: (userId: string) => Promise<void>;
  
  // Локация
  toggleLocationSharing: () => Promise<void>;
  updateMyLocation: (latitude: number, longitude: number, accuracy: number) => Promise<void>;
  
  // Списки
  loadBlockedUsers: () => Promise<void>;
  loadFollowers: () => Promise<void>;
  loadFollowing: () => Promise<void>;
  
  // Синхронизация контактов
  requestContactsPermission: () => Promise<boolean>;
  syncContacts: () => Promise<void>;
  
  // Геолокация
  requestLocationPermission: () => Promise<boolean>;
  findNearby: (radius?: number) => Promise<void>;
  
  // Предложения на основе интересов
  loadMutualInterests: () => Promise<void>;
  
  // QR
  loadMyQR: () => Promise<void>;
  scanQR: (qrData: string) => Promise<Friend | null>;
  
  // Фильтры
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
  
  // Утилиты
  clearError: () => void;
  reset: () => void;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  // Начальное состояние
  friends: [],
  incomingRequests: [],
  outgoingRequests: [],
  searchResults: [],
  blockedUsers: [],
  followers: [],
  following: [],
  suggestions: {
    contacts: [],
    nearby: [],
    interests: [],
  },
  selectedFriend: null,
  friendActivity: [],
  friendStats: null,
  friendReliability: null,
  friendLocation: null,
  sharedTrips: [],
  loading: {
    friends: false,
    requests: false,
    search: false,
    sync: false,
    nearby: false,
    interests: false,
    friendDetails: false,
    location: false,
  },
  permissions: {
    contacts: null,
    location: null,
  },
  locationSharingEnabled: false,
  searchFilters: {},
  myQRCode: null,
  error: null,

  // Загрузка списка друзей
  loadFriends: async () => {
    set(state => ({ loading: { ...state.loading, friends: true }, error: null }));
    try {
      const friends = await friendsApi.getFriends();
      set({ friends });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить друзей' });
    } finally {
      set(state => ({ loading: { ...state.loading, friends: false } }));
    }
  },

  // Загрузка запросов в друзья
  loadRequests: async () => {
    set(state => ({ loading: { ...state.loading, requests: true }, error: null }));
    try {
      const [incoming, outgoing] = await Promise.all([
        friendsApi.getIncomingRequests(),
        friendsApi.getOutgoingRequests(),
      ]);
      set({ incomingRequests: incoming, outgoingRequests: outgoing });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить запросы' });
    } finally {
      set(state => ({ loading: { ...state.loading, requests: false } }));
    }
  },

  // Поиск друзей
  searchFriends: async (filters: SearchFilters) => {
    set(state => ({ loading: { ...state.loading, search: true }, error: null }));
    try {
      const results = await friendsApi.search(filters);
      set({ searchResults: results });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка поиска', searchResults: [] });
    } finally {
      set(state => ({ loading: { ...state.loading, search: false } }));
    }
  },

  // Найти по ID
  findById: async (userId: string): Promise<Friend | null> => {
    set({ error: null });
    try {
      const friend = await friendsApi.findById(userId);
      return friend;
    } catch (error: any) {
      set({ error: error.message || 'Пользователь не найден' });
      return null;
    }
  },

  // Отправить запрос в друзья
  sendFriendRequest: async (userId: string, message?: string) => {
    set({ error: null });
    try {
      const request = await friendsApi.sendRequest(userId, message);
      set(state => ({
        outgoingRequests: [...state.outgoingRequests, request],
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось отправить запрос' });
      throw error;
    }
  },

  // Принять запрос
  acceptRequest: async (requestId: string) => {
    set({ error: null });
    try {
      await friendsApi.acceptRequest(requestId);
      const request = get().incomingRequests.find(r => r.id === requestId);
      if (request) {
        set(state => ({
          incomingRequests: state.incomingRequests.filter(r => r.id !== requestId),
          friends: [...state.friends, request.from],
        }));
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось принять запрос' });
      throw error;
    }
  },

  // Отклонить запрос
  rejectRequest: async (requestId: string) => {
    set({ error: null });
    try {
      await friendsApi.rejectRequest(requestId);
      set(state => ({
        incomingRequests: state.incomingRequests.filter(r => r.id !== requestId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось отклонить запрос' });
      throw error;
    }
  },

  // Удалить из друзей
  removeFriend: async (userId: string) => {
    set({ error: null });
    try {
      await friendsApi.removeFriend(userId);
      set(state => ({
        friends: state.friends.filter(f => f.id !== userId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить из друзей' });
      throw error;
    }
  },

  // Запросить разрешение на контакты
  requestContactsPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      set(state => ({
        permissions: { ...state.permissions, contacts: false },
      }));
      return false;
    }
    try {
      const Contacts = await import('expo-contacts');
      const { status } = await Contacts.requestPermissionsAsync();
      const granted = status === 'granted';
      set(state => ({
        permissions: { ...state.permissions, contacts: granted },
      }));
      return granted;
    } catch (error) {
      set(state => ({
        permissions: { ...state.permissions, contacts: false },
      }));
      return false;
    }
  },

  // Синхронизация контактов
  syncContacts: async () => {
    if (Platform.OS === 'web') {
      set({ error: 'Синхронизация контактов недоступна на веб-платформе' });
      return;
    }
    set(state => ({ loading: { ...state.loading, sync: true }, error: null }));
    try {
      // Проверяем разрешение
      const hasPermission = get().permissions.contacts ?? await get().requestContactsPermission();
      if (!hasPermission) {
        throw new Error('Нет доступа к контактам');
      }

      const Contacts = await import('expo-contacts');

      // Получаем контакты
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      // Хэшируем номера телефонов (для приватности)
      const phoneHashes = data
        .flatMap((contact: any) => contact.phoneNumbers?.map((p: any) => p.number) || [])
        .filter((phone: string | undefined): phone is string => Boolean(phone))
        .map((phone: string) => {
          // Простое хэширование (в реальном приложении использовать криптографию)
          const cleaned = phone.replace(/\D/g, '');
          return btoa(cleaned).substring(0, 16);
        });

      // Отправляем на сервер
      const suggestions = await friendsApi.syncContacts({ phoneHashes });
      
      set(state => ({
        suggestions: {
          ...state.suggestions,
          contacts: suggestions,
        },
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось синхронизировать контакты' });
    } finally {
      set(state => ({ loading: { ...state.loading, sync: false } }));
    }
  },

  // Запросить разрешение на геолокацию
  requestLocationPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      set(state => ({
        permissions: { ...state.permissions, location: false },
      }));
      return false;
    }
    try {
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      set(state => ({
        permissions: { ...state.permissions, location: granted },
      }));
      return granted;
    } catch (error) {
      set(state => ({
        permissions: { ...state.permissions, location: false },
      }));
      return false;
    }
  },

  // Найти пользователей поблизости
  findNearby: async (radius: number = 5) => {
    if (Platform.OS === 'web') {
      set({ error: 'Поиск поблизости недоступен на веб-платформе' });
      return;
    }
    set(state => ({ loading: { ...state.loading, nearby: true }, error: null }));
    try {
      // Проверяем разрешение
      const hasPermission = get().permissions.location ?? await get().requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Нет доступа к геолокации');
      }

      const Location = await import('expo-location');

      // Получаем координаты
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const params: NearbyParams = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        radius,
      };

      const suggestions = await friendsApi.getNearby(params);
      
      set(state => ({
        suggestions: {
          ...state.suggestions,
          nearby: suggestions,
        },
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось найти пользователей поблизости' });
    } finally {
      set(state => ({ loading: { ...state.loading, nearby: false } }));
    }
  },

  // Загрузить предложения на основе интересов
  loadMutualInterests: async () => {
    set(state => ({ loading: { ...state.loading, interests: true }, error: null }));
    try {
      const suggestions = await friendsApi.getMutualInterests();
      set(state => ({
        suggestions: {
          ...state.suggestions,
          interests: suggestions,
        },
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить предложения' });
    } finally {
      set(state => ({ loading: { ...state.loading, interests: false } }));
    }
  },

  // Загрузить мой QR-код
  loadMyQR: async () => {
    set({ error: null });
    try {
      const qrData = await friendsApi.getMyQR();
      set({ myQRCode: qrData });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить QR-код' });
    }
  },

  // Сканировать QR-код
  scanQR: async (qrData: string): Promise<Friend | null> => {
    set({ error: null });
    try {
      const friend = await friendsApi.scanQR(qrData);
      return friend;
    } catch (error: any) {
      set({ error: error.message || 'Неверный QR-код' });
      return null;
    }
  },

  // Отклонить и заблокировать
  rejectAndBlock: async (requestId: string) => {
    set(state => ({ loading: { ...state.loading, requests: true }, error: null }));
    try {
      await friendsApi.rejectAndBlock(requestId);
      set(state => ({
        incomingRequests: state.incomingRequests.filter(r => r.id !== requestId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось заблокировать пользователя' });
      throw error;
    } finally {
      set(state => ({ loading: { ...state.loading, requests: false } }));
    }
  },

  // Заблокировать пользователя
  blockUser: async (userId: string) => {
    set({ error: null });
    try {
      await friendsApi.blockUser(userId);
      set(state => ({
        friends: state.friends.filter(f => f.id !== userId),
      }));
      await get().loadBlockedUsers();
    } catch (error: any) {
      set({ error: error.message || 'Не удалось заблокировать пользователя' });
      throw error;
    }
  },

  // Разблокировать пользователя
  unblockUser: async (userId: string) => {
    set({ error: null });
    try {
      await friendsApi.unblockUser(userId);
      set(state => ({
        blockedUsers: state.blockedUsers.filter(u => u.id !== userId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось разблокировать пользователя' });
      throw error;
    }
  },

  // Установить категорию друга
  setFriendCategory: async (userId: string, category: FriendCategory) => {
    set({ error: null });
    try {
      await friendsApi.setFriendCategory(userId, category);
      set(state => ({
        friends: state.friends.map(f =>
          f.id === userId ? { ...f, category } : f
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Не удалось изменить категорию' });
      throw error;
    }
  },

  // Получить друзей по категории
  getFriendsByCategory: async (category: FriendCategory): Promise<Friend[]> => {
    try {
      return await friendsApi.getFriendsByCategory(category);
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить друзей' });
      return [];
    }
  },

  // Загрузить детали друга
  loadFriendDetails: async (userId: string) => {
    set(state => ({ loading: { ...state.loading, friendDetails: true }, error: null }));
    try {
      const [friend, stats, reliability] = await Promise.all([
        friendsApi.findById(userId),
        friendsApi.getFriendStats(userId),
        friendsApi.getFriendReliability(userId),
      ]);
      set({
        selectedFriend: friend,
        friendStats: stats,
        friendReliability: reliability,
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить данные друга' });
    } finally {
      set(state => ({ loading: { ...state.loading, friendDetails: false } }));
    }
  },

  // Загрузить активность друга
  loadFriendActivity: async (userId: string, limit: number = 20) => {
    set({ error: null });
    try {
      const activity = await friendsApi.getFriendActivity(userId, limit);
      set({ friendActivity: activity });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить активность' });
    }
  },

  // Загрузить локацию друга
  loadFriendLocation: async (userId: string) => {
    set(state => ({ loading: { ...state.loading, location: true }, error: null }));
    try {
      const location = await friendsApi.getFriendLocation(userId);
      set({ friendLocation: location });
    } catch (error: any) {
      set({ friendLocation: null });
    } finally {
      set(state => ({ loading: { ...state.loading, location: false } }));
    }
  },

  // Загрузить совместные походы
  loadSharedTrips: async (userId: string) => {
    set({ error: null });
    try {
      const trips = await friendsApi.getSharedTrips(userId);
      set({ sharedTrips: trips });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить историю походов' });
    }
  },

  // Переключить шаринг локации
  toggleLocationSharing: async () => {
    set({ error: null });
    try {
      const newState = !get().locationSharingEnabled;
      await friendsApi.toggleLocationSharing(newState);
      set({ locationSharingEnabled: newState });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось изменить настройки' });
      throw error;
    }
  },

  // Обновить мою локацию
  updateMyLocation: async (latitude: number, longitude: number, accuracy: number) => {
    if (!get().locationSharingEnabled) return;
    
    try {
      await friendsApi.updateMyLocation(latitude, longitude, accuracy);
    } catch (error: any) {
      // Тихая ошибка - не показываем пользователю
      console.error('Failed to update location:', error);
    }
  },

  // Загрузить заблокированных пользователей
  loadBlockedUsers: async () => {
    set({ error: null });
    try {
      const blocked = await friendsApi.getBlockedUsers();
      set({ blockedUsers: blocked });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить заблокированных' });
    }
  },

  // Загрузить подписчиков
  loadFollowers: async () => {
    set({ error: null });
    try {
      const followers = await friendsApi.getFollowers();
      set({ followers });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить подписчиков' });
    }
  },

  // Загрузить подписки
  loadFollowing: async () => {
    set({ error: null });
    try {
      const following = await friendsApi.getFollowing();
      set({ following });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить подписки' });
    }
  },

  // Установить фильтры поиска
  setSearchFilters: (filters: Partial<SearchFilters>) => {
    set(state => ({
      searchFilters: { ...state.searchFilters, ...filters },
    }));
  },

  // Очистить фильтры
  clearSearchFilters: () => {
    set({ searchFilters: {} });
  },

  // Очистить ошибку
  clearError: () => {
    set({ error: null });
  },

  // Сброс состояния
  reset: () => {
    set({
      friends: [],
      incomingRequests: [],
      outgoingRequests: [],
      searchResults: [],
      suggestions: {
        contacts: [],
        nearby: [],
        interests: [],
      },
      searchFilters: {},
      myQRCode: null,
      error: null,
    });
  },
}));
