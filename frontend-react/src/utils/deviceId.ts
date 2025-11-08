import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

export async function getDeviceId() {

  // ✅ Web: dùng localStorage
  if (Platform.OS === 'web') {
    let id = localStorage.getItem('device_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('device_id', id);
    }
    return id;
  }

  // ✅ iOS + Android: dùng SecureStore
  let id = await SecureStore.getItemAsync('device_id');

  if (!id) {
    id = uuidv4();
    await SecureStore.setItemAsync('device_id', id);
  }

  return id;
}
