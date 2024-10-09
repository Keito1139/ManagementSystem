import { Stack } from 'expo-router';

const Index = () => {
  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
    </Stack>
  );
};

export default Index;
