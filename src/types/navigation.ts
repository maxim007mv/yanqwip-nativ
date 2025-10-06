import { GeneratedRoute, SavedRouteDetail } from './api';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Agent: undefined;
  Places: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  RouteWizard: undefined;
  RouteResult: { route: GeneratedRoute };
  RouteDetails: { routeId: number };
  RouteView: { route: SavedRouteDetail };
  EditProfile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList { }
  }
}
