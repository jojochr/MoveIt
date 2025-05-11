import { Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';

const PrTrackerHomeScreen = () => {
  return (
    <>
      <Drawer.Screen options={{ title: 'PR Tracker Home' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to PR-Tracker</Text>
      </View>
    </>
  );
};

export default PrTrackerHomeScreen;
