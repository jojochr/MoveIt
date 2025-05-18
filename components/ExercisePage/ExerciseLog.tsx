import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { ExerciseLogEntry } from '@/app/exercise/[id]';

interface Props {
  logEntries: ExerciseLogEntry[];
}

export const ExerciseLog = ({ logEntries }: Props) => {
  return (
    <View>
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialCommunityIcons name="history" size={26} color="black" />
        <Text className="text-2xl font-bold">History Log</Text>
      </View>

      <ScrollView scrollEnabled={true}>
        {[...logEntries]
          .sort((first, second) => {
            return second.date.getTime() - first.date.getTime();
          })
          .map((log, index) => (
            <View key={index} className="m-2 flex flex-row gap-6 rounded-md bg-gray-100 px-3 pb-1 pt-1">
              <Text className="flex-1 text-lg text-gray-500">
                {log.date.getHours()}:{log.date.getMinutes()} {log.date.getDate()}.{log.date.getMonth() + 1}.{log.date.getFullYear()}
              </Text>

              <Text>{log.maxWeight} kg</Text>
              <Text>{log.repetitions} reps</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};
