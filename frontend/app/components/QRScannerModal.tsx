import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useFriendsStore } from '@/store/friendsStore';
import type { Friend } from '@/lib/types';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onUserFound?: (user: Friend) => void;
}

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  visible,
  onClose,
  onUserFound,
}) => {
  const [CameraView, setCameraView] = useState<any>(null);
  const [useCameraPermissions, setUseCameraPermissions] = useState<any>(null);
  const [permission, setPermission] = useState<any>(null);
  const [requestPermission, setRequestPermission] = useState<any>(() => () => {});
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { scanQR, sendFriendRequest } = useFriendsStore();

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    import('expo-camera').then(module => {
      setCameraView(() => module.CameraView);
      setUseCameraPermissions(() => module.useCameraPermissions);
    });
  }, []);

  useEffect(() => {
    if (useCameraPermissions) {
      const [perm, reqPerm] = useCameraPermissions();
      setPermission(perm);
      setRequestPermission(() => reqPerm);
    }
  }, [useCameraPermissions]);

  useEffect(() => {
    if (visible && permission && !permission.granted) {
      requestPermission();
    }
  }, [visible, permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      const user = await scanQR(data);
      
      if (user) {
        Alert.alert(
          'Пользователь найден',
          `${user.name} (@${user.username})`,
          [
            {
              text: 'Отмена',
              style: 'cancel',
              onPress: () => {
                setScanned(false);
                setLoading(false);
              },
            },
            {
              text: 'Добавить в друзья',
              onPress: async () => {
                try {
                  await sendFriendRequest(user.id);
                  Alert.alert('Успешно', 'Запрос отправлен');
                  onUserFound?.(user);
                  onClose();
                } catch (error) {
                  Alert.alert('Ошибка', 'Не удалось отправить запрос');
                  setScanned(false);
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Ошибка', 'Неверный QR-код');
        setScanned(false);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отсканировать QR-код');
      setScanned(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setScanned(false);
    setLoading(false);
    onClose();
  };

  if (Platform.OS === 'web') {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.permissionContainer}>
          <BlurView intensity={90} tint="dark" style={styles.permissionBlur}>
            <Ionicons name="qr-code-outline" size={64} color={Colors.dark.text2} />
            <Text style={styles.permissionTitle}>Недоступно на веб</Text>
            <Text style={styles.permissionText}>
              Сканирование QR-кодов доступно только в мобильном приложении
            </Text>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </Modal>
    );
  }

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.permissionContainer}>
          <BlurView intensity={90} tint="dark" style={styles.permissionBlur}>
            <Ionicons name="camera-outline" size={64} color={Colors.dark.text2} />
            <Text style={styles.permissionTitle}>Нужен доступ к камере</Text>
            <Text style={styles.permissionText}>
              Разрешите доступ к камере для сканирования QR-кодов
            </Text>
            <View style={styles.permissionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
                <Text style={styles.grantButtonText}>Разрешить</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          {/* Overlay */}
          <View style={styles.overlay}>
            {/* Top blur */}
            <BlurView intensity={20} tint="dark" style={styles.overlayTop}>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color={Colors.dark.text1} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Сканировать QR-код</Text>
                <View style={{ width: 28 }} />
              </View>
            </BlurView>

            {/* Scan area frame */}
            <View style={styles.scanAreaContainer}>
              <View style={styles.scanArea}>
                {/* Corners */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                
                {loading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.dark.accent} />
                  </View>
                )}
              </View>
            </View>

            {/* Bottom blur */}
            <BlurView intensity={20} tint="dark" style={styles.overlayBottom}>
              <Ionicons name="qr-code-outline" size={48} color={Colors.dark.text2} />
              <Text style={styles.instruction}>
                Наведите камеру на QR-код профиля
              </Text>
              <Text style={styles.instructionSub}>
                QR-код можно найти в профиле пользователя
              </Text>
            </BlurView>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlayTop: {
    paddingTop: 50,
    paddingBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.dark.accent,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  overlayBottom: {
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  instruction: {
    fontSize: Typography.body,
    fontWeight: Typography.medium,
    color: Colors.dark.text1,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  instructionSub: {
    fontSize: Typography.caption,
    color: Colors.dark.text3,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  permissionBlur: {
    width: width * 0.85,
    borderRadius: 20,
    padding: Spacing.xxl,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  permissionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semiBold,
    color: Colors.dark.text1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  permissionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.body,
    color: Colors.dark.text2,
  },
  grantButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
  },
  grantButtonText: {
    fontSize: Typography.body,
    color: Colors.dark.text1,
    fontWeight: Typography.semiBold,
  },
});
