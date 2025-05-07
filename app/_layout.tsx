import '../global.css';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
        }}>
        {/*<Drawer>*/}
        <Drawer.Screen
          name={'index'}
          options={{
            drawerLabel: 'Home',
            headerTitle: 'Home',
            drawerIcon: ({ size, color }) => <Ionicons name={'home-outline'} size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name={'pr-tracker-home'}
          options={{
            drawerLabel: 'PR Tracker',
            headerTitle: 'PR Tracker',
            drawerIcon: ({ size, color }) => <MaterialCommunityIcons name="dumbbell" size={size} color={color} />,
          }}
        />

        <Drawer.Screen name={'exercise/[id]'} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const IDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <View style={{ flex: 1, paddingTop: Math.max(top, 15), paddingBottom: Math.max(bottom, 15) }}>
      <DrawerItemList {...props} />

      <DrawerContentScrollView {...props} scrollEnabled={true}>
        {/*Create dummy exercises to populate the drawer*/}
        {IDs.map(id => (
          <DrawerItem label={`Exercise \"${id}\"`} key={id} onPress={() => router.replace(`/exercise/${id}`)} />
        ))}
      </DrawerContentScrollView>
    </View>
  );
};

export default DrawerLayout;
