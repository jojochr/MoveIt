import '../global.css';
import { Drawer } from 'expo-router/drawer';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppWrapper } from '@/utils/AppWrapper';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { useEffect, useState } from 'react';
import { Exercise } from '@/db/schema';
import { ScrollView } from 'react-native-gesture-handler';

const DrawerLayout = () => {
  return (
    <AppWrapper>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: false,
        }}>
        <Drawer.Screen
          name={'index'}
          options={{
            drawerLabel: 'Home',
            headerTitle: 'Home',
            drawerIcon: ({ size, color }) => <Ionicons name={'home-outline'} size={size} color={color} />,
          }}
        />

        {/*********************************************************/}
        {/*Under here are items that should not always be rendered*/}
        {/*********************************************************/}

        {process.env.EXPO_PUBLIC_DEBUG_MODE ? (
          <Drawer.Screen
            name={'debug'}
            options={{
              drawerLabel: 'Debug',
              headerTitle: 'Debug Mode',
              drawerLabelStyle: { fontWeight: '800', color: '#c084fc' },
              drawerIcon: ({ size }) => <FontAwesome name="code" size={size} color="#9333ea" />,
            }}
          />
        ) : (
          // Hide debug tab if debug is not enabled
          <Drawer.Screen name={'debug'} options={{ drawerItemStyle: { display: 'none' } }} />
        )}

        <Drawer.Screen name={'pr-tracker-home'} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name={'exercise/[id]'} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </AppWrapper>
  );
};

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const pathName = usePathname();
  const { top, bottom } = useSafeAreaInsets();

  const expo_db = useSQLiteContext();
  const drizzle_db = drizzle(expo_db, { schema });

  const [exTabs, set_exTabs] = useState<Exercise[]>([]);
  const { data } = useLiveQuery(drizzle_db.query.exercises.findMany());
  useEffect(() => {
    set_exTabs(data);
  }, [data]);

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
      </View>
    </View>
  );
};

export default DrawerLayout;
