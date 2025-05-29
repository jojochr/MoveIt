import '../global.css';
import { Drawer } from 'expo-router/drawer';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { MainCustomDrawer } from '@/components/MainCustomDrawer';
import { AppWrapper } from '@/utils/AppWrapper';

const DrawerLayout = () => {
  return (
    <AppWrapper>
      <Drawer
        drawerContent={MainCustomDrawer}
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

        {/* These buttons are used in custom drawer, and should not automatically be included in main drawer */}
        <Drawer.Screen name={'pr-tracker-home'} options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name={'exercise/[id]'} options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </AppWrapper>
  );
};

export default DrawerLayout;
