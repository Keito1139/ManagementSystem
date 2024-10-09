import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
import axios from 'axios';

// 型定義
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

// LoginScreenコンポーネント
const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        email,
        password,
      });
      handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  };

  const handleResponse = async (response: any) => {

    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
      Alert.alert('ログイン成功');
      router.push('/home');
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || 'ログイン失敗';
      Alert.alert('ログイン失敗', errorMessage);
    } else {
      Alert.alert('通信エラー', '予期しないエラーが発生しました');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <Button title="ログイン" onPress={handleLogin} />
    </View>
  );
};

export default Login;
