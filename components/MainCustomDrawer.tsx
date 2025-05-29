import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { useEffect, useState } from 'react';
import { Exercise } from '@/db/schema';
import { DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Pressable, Text, View } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

export const MainCustomDrawer = (props: any) => {
  const router = useRouter();
  const pathName = usePathname();
  const { top, bottom } = useSafeAreaInsets();

  const expo_db = useSQLiteContext();
  const drizzle_db = drizzle(expo_db, { schema });

  const [exTabs, set_exTabs] = useState<Exercise[]>([]);
  const { data } = useLiveQuery(drizzle_db.query.exercises.findMany());
  useEffect(() => set_exTabs(data), [data]);

  return (
    <View style={{ flex: 1, paddingTop: Math.max(top, 15), paddingBottom: Math.max(bottom, 15) }}>
      <DrawerItemList {...props} />

      <View className="m-4 h-min shrink gap-4 rounded-xl bg-gray-200 p-4">
        <DrawerItem
          focused={pathName === '/pr-tracker-home'}
          label="PR Tracker Home"
          icon={({ size, color }) => <MaterialCommunityIcons name="dumbbell" size={size} color={color} />}
          onPress={() => router.replace(`/pr-tracker-home`)}
        />

        <View className="h-0.5 bg-gray-500" />

        {exTabs.length > 0 ? (
          <ScrollView>
            {exTabs.map(exercise => (
              <DrawerItem
                focused={pathName === `/exercise/${exercise.id}`}
                label={`- ${exercise.name}`}
                key={exercise.id}
                onPress={() => {
                  router.push(`/exercise/${exercise.id}`);
                }}
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex items-center">
            <Text className="text-lg text-gray-600">No exercises created yet</Text>
          </View>
        )}
        <Pressable
          className="items-center rounded-md bg-blue-600 p-2 hover:bg-blue-700 active:opacity-20"
          onPress={() => {
            router.push('/exercise/create-new');
          }}>
          <AntDesign name="pluscircle" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
