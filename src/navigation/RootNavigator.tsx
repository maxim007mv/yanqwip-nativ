import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {useAuthStore} from '../store/auth.store';
import {COLORS} from '../constants/theme';
import type {AppStackParamList, AuthStackParamList, MainTabParamList} from '../types/navigation';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AgentScreen from '../screens/AgentScreen';
import PlacesScreen from '../screens/PlacesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RouteWizardScreen from '../screens/RouteWizardScreen';
import RouteResultScreen from '../screens/RouteResultScreen';
import RouteDetailsScreen from '../screens/RouteDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: COLORS.accentMint,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderTopWidth: 0,
        height: 84,
        paddingVertical: 12,
      },
      tabBarIcon: ({color, size, focused}) => {
        const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
          Home: focused ? 'home' : 'home-outline',
          Agent: focused ? 'chatbubbles' : 'chatbubbles-outline',
          Places: focused ? 'location' : 'location-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return (
          <Ionicons
            name={iconMap[route.name as keyof MainTabParamList]}
            color={color}
            size={size}
          />
        );
      },
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Agent" component={AgentScreen} />
    <Tab.Screen name="Places" component={PlacesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
    <AppStack.Screen name="MainTabs" component={MainTabs} />
    <AppStack.Screen name="RouteWizard" component={RouteWizardScreen} />
    <AppStack.Screen name="RouteResult" component={RouteResultScreen} />
    <AppStack.Screen name="RouteDetails" component={RouteDetailsScreen} />
    <AppStack.Screen name="EditProfile" component={EditProfileScreen} />
  </AppStack.Navigator>
);

export const RootNavigator = () => {
  const user = useAuthStore(state => state.user);
  const isGuest = useAuthStore(state => state.isGuest);

  return (
    <NavigationContainer>
      {user || isGuest ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
