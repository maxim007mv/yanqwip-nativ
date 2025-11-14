import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useUIStore } from '@/store/uiStore';
import { Colors } from '@/lib/theme';
import type { RootStackParamList, MainTabParamList } from '@/navigation/RootNavigator';

type NavigationPropType = NavigationProp<RootStackParamList>;

interface TabItem {
  name: keyof MainTabParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: 'Main';
}

const TABS: TabItem[] = [
  { name: 'Home', label: 'Дом', icon: 'home-outline', route: 'Main' },
  { name: 'Places', label: 'Места', icon: 'map-outline', route: 'Main' },
  { name: 'Agent', label: 'Агент', icon: 'chatbubbles-outline', route: 'Main' },
  { name: 'Profile', label: 'Профиль', icon: 'person-outline', route: 'Main' },
];

export function BottomTabBar() {
  const { theme } = useUIStore();
  const navigation = useNavigation<NavigationPropType>();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleTabPress = (tab: TabItem) => {
    // Навигация к Main табу с нужным экраном
    navigation.navigate('Main', {
      screen: tab.name,
    } as any);
  };

  return (
    <View style={[styles.container, { pointerEvents: 'box-none', opacity: 0 }]}>
      <View style={[styles.tabBarContainer, { backgroundColor: 'transparent' }]}>
        <BlurView
          intensity={20}
          tint={isDark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
        />
        <View style={styles.tabBarContent}>
          {TABS.map((tab) => {
            const isActive = false; // На этих экранах ни одна вкладка не активна
            const iconColor = isActive ? colors.accent : colors.text3;
            const labelColor = isActive ? colors.accent : colors.text3;

            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => handleTabPress(tab)}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={tab.icon} size={25} color={iconColor} />
                </View>
                <Text style={[styles.tabLabel, { color: labelColor }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 76,
    borderRadius: 26,
  },
  tabBarContainer: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 16,
  },
  tabBarContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 25,
    height: 25,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

