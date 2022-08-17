import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, set } from 'lodash';

export const getStorage = async (path?: string) => {
  const storeStr = (await AsyncStorage.getItem('KarfUI')) || '{}';
  const store = JSON.parse(storeStr);
  if (!!path) {
    return get(store, path);
  }
  return store;
};

export const setStorage = async (path: string, value: string) => {
  const store = await getStorage();
  set(store, path, value);
  await AsyncStorage.setItem('KarfUI', JSON.stringify(store));
};
