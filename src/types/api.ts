export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  created_at: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface RouteStep {
  title: string;
  description: string;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  address?: string | null;
  website?: string | null;
  coordinates?: Coordinates | null;
}

export interface RouteSummary {
  intro?: string | null;
  transport?: string | null;
  budget?: string | null;
  food?: string | null;
  tips?: string | null;
  weather_plan?: string | null;
}

export interface GeneratedRoute {
  route_id: string;
  title: string;
  summary: RouteSummary;
  steps: RouteStep[];
  yandex_url?: string | null;
  created_at: string;
  raw_response: string;
}

export interface SavedRouteSummary {
  id: number;
  title: string;
  created_at: string;
}

export interface SavedRouteDetail extends SavedRouteSummary {
  summary: RouteSummary;
  steps: RouteStep[];
  yandex_url?: string | null;
  raw_response?: string | null;
}

export interface Place {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  categories: string[];
  source: string;
  distance_m?: number | null;
  external_id?: string | null;
  description?: string | null;
  website?: string | null;
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResponse {
  reply: string;
  created_at: string;
}

export interface RouteGeneratePayload {
  start_time: string;
  duration: string;
  walk_type: string;
  start_point: string;
  budget: string;
  preferences: string;
  activities: string;
  food: string;
  transport: string;
  limitations: string;
  context?: string | null;
}

export interface RouteSavePayload {
  title: string;
  summary: RouteSummary;
  steps: RouteStep[];
  yandex_url?: string | null;
  deepseek_raw: string;
}

export interface PlacesResponse {
  places: Place[];
}

// Job-based generation
export interface JobCreateResponse {
  job_id: string;
}

export type JobStatus = 'pending' | 'running' | 'done' | 'error';

export interface JobStatusResponse {
  status: JobStatus;
  partial?: boolean;
  error?: string | null;
  route?: SavedRouteDetail; // full route when done
}
