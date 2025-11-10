export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  city?: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ru' | 'en';
  notifications: boolean;
  location: boolean;
}

export interface Route {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  steps: RouteStep[];
  tips: string[];
  totalDuration: number; // minutes
  city: string;
  createdAt: string;
  userId: string;
  isPublic: boolean;
  likes?: number;
  views?: number;
  yandexUrl?: string; // Ссылка на Яндекс.Карты
}

export interface RouteStep {
  id: string;
  title: string;
  description: string;
  address: string;
  category: PlaceCategory;
  duration: number; // minutes
  coordinates?: {
    lat: number;
    lon: number;
  };
  order: number;
  tips?: string[];
  openHours?: string;
  price?: string;
}

export interface Place {
  id: string;
  title: string;
  description: string;
  address: string;
  category: PlaceCategory;
  area: string;
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1-4
  imageUrl: string;
  isOpen: boolean;
  isFavorite?: boolean;
  coordinates?: {
    lat: number;
    lon: number;
  };
  tags: string[];
}

export type PlaceCategory = 
  | 'cafe' 
  | 'restaurant' 
  | 'park' 
  | 'museum' 
  | 'romantic' 
  | 'entertainment'
  | 'shopping'
  | 'culture'
  | 'all';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export interface WizardAnswer {
  questionId: string;
  question: string;
  answer: string | string[];
  type: 'text' | 'select' | 'multiselect' | 'range';
}

export interface GenerateRouteRequest {
  answers: WizardAnswer[];
  context: {
    city: string;
    budget?: string;
    categories?: PlaceCategory[];
    userId?: string;
  };
}

export interface GenerateRouteResponse {
  route: Route;
  estimatedTime: number; // seconds for generation
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
