import { Text, View, ScrollView, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Exercise, ExerciseLogEntry } from '@/model/Exercise';
import {
  AddHistoryEntry,
  AddNewExercise,
  DeSelectItem,
  exerciseStore$,
  SelectedItem$,
  SelectItem,
  ValidateAndPatch,
} from '@/model/ExerciseStore';
import { use$ } from '@legendapp/state/react';
import { DataSet, LineChart, lineDataItem } from 'react-native-gifted-charts';
import { observable } from '@legendapp/state';
import Divider from '@/components/Divider';
import { useEffect } from 'react';

// Icons
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

const maxWeight$ = observable<number>(0);
const repetitions$ = observable<number>(0);

const showExerciseCreator$ = observable<boolean>(false);
const createExerciseInfo$ = observable<{ name: string; reset: () => void }>({
  name: '',
  reset: () => {
    createExerciseInfo$.name.set('');
  },
});
const createExerciseValidationErrors$ = observable<{
  nameTooShort: boolean;
  nameTooLong: boolean;
  nameInvalidCharacter: boolean;
  hasErrors: () => boolean;
  reset: () => void;
}>({
  nameTooShort: false,
  nameTooLong: false,
  nameInvalidCharacter: false,
  hasErrors: (): boolean => {
    return (
      createExerciseValidationErrors$.nameTooShort.get() ||
      createExerciseValidationErrors$.nameTooLong.get() ||
      createExerciseValidationErrors$.nameInvalidCharacter.get()
    );
  },
  reset: (): void => {
    createExerciseValidationErrors$.nameTooShort.set(false);
    createExerciseValidationErrors$.nameTooLong.set(false);
    createExerciseValidationErrors$.nameInvalidCharacter.set(false);
  },
});

export default function PRTrackerScreen() {
  useEffect(() => {
    // Make sure we are initialized correctly
    ValidateAndPatch(exerciseStore$);

    // Debug
    OnCreatingExercise();
  }, []);

  // Do null check here because this is sometimes, for some reason undefined on android version
  const exercises = use$(() => exerciseStore$.exercises.get() ?? []);
  const selectedExercise: Exercise | null = use$(SelectedItem$);

  const maxWeightAsString = use$(() => maxWeight$.get().toString());
  const repetitionsString = use$(() => repetitions$.get().toString());

  const showExerciseCreator = use$(showExerciseCreator$);
  const createExerciseInfo: { name: string } = use$(createExerciseInfo$);
  const creatorHasValidationErrors = use$(createExerciseValidationErrors$.hasErrors);
  const nameTooShort = use$(createExerciseValidationErrors$.nameTooLong);
  const nameTooLong = use$(createExerciseValidationErrors$.nameInvalidCharacter);
  const nameInvalidCharacter = use$(createExerciseValidationErrors$.nameInvalidCharacter);

  const chartData: DataSet[] | null = use$(() => {
    const history = SelectedItem$.get()?.exerciseHistory;
    if (!history) return null;

    return null;
    // return [
    //   {
    //     data: history.map(log => {
    //       return {
    //         value: log.maxWeight,
    //         label: 'Max Weight (kg)',
    //         dataPointColor: '#4287f5',
    //         stripColor: '#f5dd42',
    //         textColor: '#45f542',
    //       } as lineDataItem;
    //     }) as lineDataItem[],
    //     thickness: 5,
    //     color: '#f5424b',
    //   } as DataSet,
    //   // {
    //   //     data: history.map(log => {
    //   //         return {
    //   //             value: log.repetitions,
    //   //             label: 'Repetitions',
    //   //         } as lineDataItem;
    //   //     }) as lineDataItem[],
    //   // } as DataSet,
    // ] as DataSet[];
  });

  /**
   * Gets run when the "+"-button to create a new exercise gets pushed
   */
  function OnCreatingExercise(): void {
    DeSelectItem();
    showExerciseCreator$.set(true);
    createExerciseInfo$.reset();
  }

  /**
   * This takes the new value for the name in the exercise creator and validates it
   * After validation the name automatically gets set to the non-persisted store
   * @param newName The new entered value for the name
   */
  function ValidateAndSetName(newName: string): void {
    if (!newName) newName = '';

    // Do a lot of checks
    createExerciseValidationErrors$.nameTooShort.set(newName.length < 5);
    createExerciseValidationErrors$.nameTooLong.set(newName.length > 20);
    createExerciseValidationErrors$.nameInvalidCharacter.set(/^[A-Za-z]+$/.test(newName));

    createExerciseInfo$.name.set(newName);
  }

  /**
   * Gets run on Save in Exercise Creator window
   * @constructor
   */
  function OnSaveExercise(): void {
    // Make really sure we never save if there are validation errors
    if (createExerciseValidationErrors$.hasErrors()) return;

    AddNewExercise(createExerciseInfo.name);
    showExerciseCreator$.set(false);
    createExerciseInfo$.reset();
    createExerciseValidationErrors$.reset();
  }

  /**
   * Gets run when exercise Creation is canceled
   * @constructor
   */
  function OnCancelSaveExercise(): void {
    showExerciseCreator$.set(false);
    createExerciseInfo$.reset();
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
                  if (showExerciseCreator) {
                    return;
                  }

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
      {showExerciseCreator ? (
        <View className="bg-white m-2 p-6 rounded-xl">
          <View className="flex-row gap-2 items-center">
            <Entypo className="pb-2.5" name="add-to-list" size={32} color="black" />
            <Text className="text-2xl font-bold text-black mb-4">Exercise Creator</Text>
          </View>

          <Text className="text-gray-500 mb-0.5">Display name:</Text>
          <TextInput
            className="border-2 border-gray-400 rounded-md p-2 text-base"
            value={createExerciseInfo.name}
            //todo: This will break. I need a proper Number input
            onChangeText={newVal => ValidateAndSetName(newVal)}
            keyboardType="numeric"
          />

          <View className="flex-row justify-center items-center gap-5 mt-auto">
            <View className="flex-row justify-center items-center gap-5 mt-auto">
              {/*Todo: String validation for Name*/}
              <Pressable
                disabled={creatorHasValidationErrors}
                className="flex flex-row p-2 pr-3 rounded-md items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 transition-colors"
                onPress={OnSaveExercise}>
                <Feather name="check" size={24} color="black" />
                <Text>Submit</Text>
              </Pressable>
              <Pressable
                className="flex flex-row p-2 pr-3 rounded-md items-center justify-center gap-2 bg-gray-300 hover:bg-gray-500 transition-colors"
                onPress={OnCancelSaveExercise}>
                <Feather name="x" size={24} color="black" />
                <Text>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : selectedExercise ? (
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
    </View>
  );
}

const ExerciseChart = (props: { className?: string; chartData: DataSet[] }) => {
  return (
    <View className={(props.className ?? '') + ''}>
      <LineChart dataSet={props.chartData} />
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
