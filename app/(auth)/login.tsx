import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

// RootStackParamListの定義（例）
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');



  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });

      const data = response.data;

      // HTTPステータス200台の場合は成功とみなす
      if (response.status >= 200 && response.status < 300) {
        // トークンをAsyncStorageに保存
        await AsyncStorage.setItem('access_token', data.access);
        await AsyncStorage.setItem('refresh_token', data.refresh);
        Alert.alert('ログイン成功');
        navigation.navigate('Home'); // ログイン後の画面へ
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // サーバーからのエラーメッセージを取得
        const errorMessage = error.response?.data?.detail || 'ログイン失敗';
        Alert.alert('ログイン失敗', errorMessage);
      } else {
        // ネットワークエラーなどその他のエラー処理
        Alert.alert('通信エラー', '予期しないエラーが発生しました');
      }
    }
  };

  // スタイルの定義
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ユーザー名"
        value={username}
        onChangeText={setUsername}
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

export default LoginScreen;