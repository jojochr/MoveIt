import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ExerciseScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Exercise with id &quot;{id}&quot;</Text>
    </View>
  );
};

export default ExerciseScreen;
