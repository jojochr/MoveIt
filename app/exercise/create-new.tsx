import { Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';

const CreateNewExerciseScreen = () => {
  return (
    <>
      <Drawer.Screen options={{ title: 'Create New Exercise' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to the exercise creation screen</Text>
      </View>
    </>
  );
};

export default CreateNewExerciseScreen;
