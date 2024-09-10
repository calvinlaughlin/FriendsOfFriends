import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'user_id';

export const storeUserId = async (userId: string) => {
    if (!userId) {
      throw new Error("Cannot store empty user ID");
    }
    try {
      await AsyncStorage.setItem('user_id', userId);
    } catch (e) {
      console.error('Error storing user ID:', e);
      throw e;
    }
  };
  
  export const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem(USER_ID_KEY);
      console.log('Retrieved user ID:', userId);
      return userId;
    } catch (e) {
      console.error('Failed to get user ID', e);
      return null;
    }
  };

export const removeUserId = async () => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (e) {
    console.error('Failed to remove user ID', e);
  }
};