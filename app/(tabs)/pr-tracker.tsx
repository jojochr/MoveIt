import { Text, View, ScrollView, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Exercise, ExerciseLogEntry } from '@/model/Exercise';
import { AddHistoryEntry, DeSelectItem, exerciseStore$, SelectedItem$, SelectItem } from '@/model/ExerciseStore';
import { use$ } from '@legendapp/state/react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { DataSet, LineChart, lineDataItem } from 'react-native-gifted-charts';
import { observable } from '@legendapp/state';
import Divider from '@/components/Divider';

const maxWeight$ = observable<number>(0);
const repetitions$ = observable<number>(0);

const creatingExercise$ = observable<boolean>(false);
const exerciseCreationInfo$ = observable<{ name: string; reset: () => void }>({
  name: '',
  reset: () => {
    exerciseCreationInfo$.name.set('');
  },
});

export default function PRTrackerScreen() {
  const exercises = use$(exerciseStore$.exercises);
  const selectedExercise: Exercise | null = use$(SelectedItem$);

  const maxWeightAsString = use$(() => maxWeight$.get().toString());
  const repetitionsString = use$(() => repetitions$.get().toString());

  // const chartData: DataSet[] = [
  //     {
  //         data: [
  //             {value: 50},
  //             {value: 75},
  //             {value: 100},
  //         ],
  //         dataPointsColor: '#4287f5',
  //         textColor: '#45f542',
  //     }
  // ]

  const chartData: DataSet[] | null = use$(() => {
    // const history = SelectedItem$.get()?.exerciseHistory;
    // if (!history) return null;

    const history: ExerciseLogEntry[] = [
      {
        maxWeight: 50,
        repetitions: 10,
        date: new Date(),
      } as ExerciseLogEntry,
      { maxWeight: 60, repetitions: 10, date: new Date() } as ExerciseLogEntry,
      {
        maxWeight: 65,
        repetitions: 10,
        date: new Date(),
      } as ExerciseLogEntry,
      { maxWeight: 50, repetitions: 12, date: new Date() } as ExerciseLogEntry,
      {
        maxWeight: 55,
        repetitions: 12,
        date: new Date(),
      } as ExerciseLogEntry,
    ];

    return [
      {
        data: history.map(log => {
          return {
            value: log.maxWeight,
            dataPointColor: '#4287f5',
            stripColor: '#f5dd42',
            textColor: '#45f542',
          };
        }),
        thickness: 5,
        color: '#f5424b',
        dataPointsColor: '#f113db',
      } as DataSet,
      {
        data: history.map(log => {
          return {
            value: log.repetitions,
          };
        }),
      } as DataSet,
    ];
  });

  /**
   * Gets run when the "+"-button to create a new exercise gets pushed
   */
  function OnCreatingExercise() {
    //Todo: Think about this one very hard
  }

  return (
    <View className="flex flex-row">
      <View className="bg-white m-2 p-4 rounded-xl w-fit h-fit">
        <View className="flex-row items-center space-x-1 mb-4">
          <MaterialCommunityIcons name="dumbbell" color="black" size={26} />
          <Text className="font-bold text-2xl">Exercises</Text>
        </View>

        <ScrollView className="w-fit">
          {exercises.map((exercise: Exercise) => {
            let isSelected: boolean = exercise === SelectedItem$.get();

            return (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => {
                  if (isSelected) {
                    DeSelectItem();
                  } else {
                    SelectItem(exercise.id);
                  }
                }}
                className={'rounded-md p-2 mb-2' + (isSelected ? ' bg-blue-500' : ' hover:bg-gray-100')}>
                <Text className={'text-lg ' + (isSelected ? 'text-white ' : 'text-black')}>{exercise.name}</Text>
              </TouchableOpacity>
            );
          })}

          <Pressable
            className="rounded-md p-2 items-center bg-blue-900 hover:bg-blue-700 active:opacity-20"
            onPress={OnCreatingExercise}>
            <AntDesign name="pluscircle" size={20} color="white" />
          </Pressable>
        </ScrollView>
      </View>

      {selectedExercise ? (
        <ScrollView className="bg-white m-2 p-6 rounded-xl">
          <Text className="text-2xl font-bold text-black mb-4">{selectedExercise.name}</Text>

          <View className="flex flex-row justify-center gap-2">
            <View className="flex-1">
              <View className="flex flex-row items-center p-2 gap-2">
                <MaterialCommunityIcons className="pt-0.5" name="weight" size={20} color="gray" />
                <Text className="text-lg text-gray-500">Maximum Weight (kg)</Text>
              </View>
              <TextInput
                className="border-2 border-gray-400 rounded-md p-4 text-base w-full"
                value={maxWeightAsString}
                //todo: This will break. I need a proper Number input
                onChangeText={newVal => maxWeight$.set(Number(newVal))}
                keyboardType="numeric"
              />
            </View>

            <View className="flex-1">
              <View className="flex flex-row items-center p-2 gap-2">
                <Feather className="pt-0.5" name="repeat" size={20} color="gray" />
                <Text className="text-lg text-gray-500">Repetitions</Text>
              </View>
              <TextInput
                className="border-2 border-gray-400 rounded-md p-4 text-base w-full"
                //todo: This will break. I need a proper Number input
                value={repetitionsString}
                onChangeText={newVal => repetitions$.set(Number(newVal))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            className="flex flex-row mt-4 mb-4 w-full bg-blue-500 hover:bg-blue-600 p-2 rounded-md transition-colors items-center justify-center gap-2"
            onPress={() => AddHistoryEntry(selectedExercise.id, maxWeight$.peek(), repetitions$.peek())}>
            <Feather name="save" size={20} color="white" />
            <Text className="text-white">Save Progress</Text>
          </TouchableOpacity>

          <View className="mb-4">
            <Divider width={1} orientation={'horizontal'} color={'#6b7280'} />
          </View>

          {chartData !== null && (
            <View>
              <View className="flex-row gap-2 mb-4">
                <AntDesign name="areachart" size={26} color="black" />
                <Text className="font-bold text-2xl">Progress Graph</Text>
              </View>
              <ExerciseChart className="" chartData={chartData} />
            </View>
          )}

          {selectedExercise.exerciseHistory.length > 0 && <ExerciseLog logEntries={selectedExercise.exerciseHistory} />}
        </ScrollView>
      ) : (
        <View className="flex-1 bg-gray-100 rounded-lg border-2 border-gray-300 justify-center items-center text-gray-500 m-2">
          <Text className="text-gray-500">Select an Exercise to track your progress</Text>
        </View>
      )}
      {/*    .kind === 'CreatingExercise' ? (*/}
      {/*  <View className="flex-1 bg-gray-100 rounded-lg border-2 border-gray-300 justify-center items-center m-2">*/}
      {/*    <Text className="text-gray-500">Exercise Creator will be here when it's done :)</Text>*/}
      {/*  </View>*/}
    </View>
  );
}

const ExerciseChart = (props: { className?: string; chartData: DataSet[] }) => {
  return (
    <View className={(props.className ?? '') + ''}>
      <LineChart
        isAnimated={true}
        animationDuration={400}
        animateOnDataChange={true}
        onDataChangeAnimationDuration={400}
        renderDataPointsAfterAnimationEnds={true}
        dataSet={props.chartData}
      />
    </View>
  );
};

const ExerciseLog = (props: { logEntries: ExerciseLogEntry[] }) => {
  return (
    <View>
      <View className="flex-row gap-2 mb-4 items-center">
        <MaterialCommunityIcons name="history" size={26} color="black" />
        <Text className="font-bold text-2xl">History Log</Text>
      </View>

      <ScrollView scrollEnabled={true}>
        {[...props.logEntries]
          .sort((first, second) => {
            return second.date.getTime() - first.date.getTime();
          })
          .map((log, index) => (
            <View key={index} className="flex flex-row pt-1 pb-1 px-3 gap-6 m-2 bg-gray-100 rounded-md">
              <Text className="flex-1 text-lg text-gray-500">
                {log.date.getHours()}:{log.date.getMinutes()} {log.date.getDay()}.{log.date.getMonth()}.
                {log.date.getFullYear()}
              </Text>

              <Text>{log.maxWeight} kg</Text>
              <Text>{log.repetitions} reps</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};
