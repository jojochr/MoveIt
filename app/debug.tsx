import { Pressable, Text, View } from 'react-native';
import { DeleteAllAndAddDummyData } from '@/utils/DummyData';
import { useSQLiteContext } from 'expo-sqlite';

const DebugScreen = () => {
  const expo_db = useSQLiteContext();

  if (!process.env.EXPO_PUBLIC_DEBUG_MODE) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You are not in debug mode</Text>
        <Text>You should not be seeing this</Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="border-4 border-purple-600 bg-purple-200 pr-3 text-center text-xl font-black text-purple-400">
        Welcome to the Debug Terminal!
      </Text>
      <Text>Only developers should see this. Please don&apos;t touch anything, if you are not coding!</Text>

      <View className="m-4 flex items-center justify-center">
        <Pressable
          className="rounded-md border-2 border-red-600 bg-red-300 p-2 active:border-red-400 active:bg-red-100"
          onPress={async () => {
            await DeleteAllAndAddDummyData(expo_db);
          }}>
          <Text>Reset DB with TestValues</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DebugScreen;
