import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// トークンが期限切れかどうかを確認する関数
const isTokenExpired = (token: string): boolean => {
  const decoded = JSON.parse(atob(token.split('.')[1])); // JWTデコード
  const exp = decoded.exp * 1000; // トークンの有効期限
  return Date.now() > exp; // 現在時刻と比較
};

// トークンのリフレッシュを行う関数
const refreshAccessTokenIfNeeded = async () => {
  const token = await AsyncStorage.getItem('access_token');
  if (token && isTokenExpired(token)) {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const { data } = await axios.post('http://localhost:8081/api/token/refresh/', {
          refresh: refreshToken,
        });
        await AsyncStorage.setItem('access_token', data.access);
      } catch (error) {
        console.error('Refresh token error:', error);
      }
    }
  }
};

// リクエスト時にトークンをヘッダーに付与するインターセプター
apiClient.interceptors.request.use(async (config) => {
  await refreshAccessTokenIfNeeded(); // トークンの更新を確認
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// APIクライアントとトークンリフレッシュ関数をエクスポート
export { apiClient, refreshAccessTokenIfNeeded };
