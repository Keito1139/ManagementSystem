import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        return token;
    } catch (error) {
        console.error('Error retrieving access token', error);
        return null;
    }
};
