export default {
  expo: {
    name: 'yanqwip',
    slug: 'yanqwip',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yanqwip.app',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0f172a',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
      },
      package: 'com.yanqwip.app',
    },
    extra: {
      eas: {
        projectId: 'e0a8b170-2b5e-41f5-b6f6-51105103c401',
      },
    },
    owner: 'tyq',
  },
};
