export default {
  expo: {
    name: "Yanqwip",
    slug: "yanqwip",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./app/assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0b0d12"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yanqwip.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Yanqwip использует вашу геолокацию для построения персонализированных маршрутов по городу.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "Yanqwip использует вашу геолокацию для построения персонализированных маршрутов по городу."
      }
    },
    android: {
      // adaptiveIcon: {
      //   foregroundImage: "./app/assets/images/adaptive-icon.png",
      //   backgroundColor: "#0b0d12"
      // },
      package: "com.yanqwip.app",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    web: {
      favicon: "./app/assets/images/favicon.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-font",
      "expo-asset"
    ],
    extra: {
      apiUrl: process.env.API_URL || "http://localhost:8000",
      yandexMapsKey: process.env.YANDEX_MAPS_KEY || "",
      eas: {
        projectId: "yanqwip-project-id"
      }
    }
  }
};
