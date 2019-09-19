import AsyncStorage from '@react-native-community/async-storage';

export const storeData = (key, value) =>
  new Promise(async function(resolve, reject) {
    try {
      await AsyncStorage.setItem(key, value);
      resolve({key: value});
    } catch (e) {
      reject(e);
    }
  });

export const getData = key =>
  new Promise(async function(resolve, reject) {
    try {
      const value = await AsyncStorage.getItem(key);
      resolve(value);
    } catch (e) {
      reject(e);
    }
  });
