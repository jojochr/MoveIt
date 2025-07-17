import { Text, View, Pressable } from 'react-native';
import { router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { ExerciseId, exercises, exercising_history } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Drawer } from 'expo-router/drawer';
import { DrawerActions } from '@react-navigation/native';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { ExercisePageInput } from '@/components/ExercisePage/ExercisePageInput';
import { ExerciseLog } from '@/components/ExercisePage/ExerciseLog';
import { ExerciseChart } from '@/components/ExercisePage/ExerciseChart';
import { DeleteExerciseModal, ModalResult as DeleteExerciseModalResult } from '@/components/ExercisePage/DeleteExerciseModal';

export interface ExerciseLogEntry {
  id: number;
  date: Date;
  maxWeight: number;
  repetitions: number;
}

const ExerciseScreen = () => {
  const db = drizzle(useSQLiteContext(), { schema });
  const router = useRouter();

  const { id: idFromParams } = useLocalSearchParams<{ id: string; rest: string[] }>();

  const id = parseInt(idFromParams);
  if (Number.isNaN(id)) {
    console.error(`Tried opening exercise with invalid ID: "${idFromParams}"`);
    router.back();
  }

  const exercise = db.query.exercises.findFirst({ where: eq(exercises.id, id as ExerciseId) }).sync();
  const { data: history } = useLiveQuery(
    db
      .select()
      .from(exercising_history)
      .where(eq(exercising_history.exerciseId, id as ExerciseId)),
    [id]
  );

  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [maxWeightIsValid, setMaxWeightIsValid] = useState<boolean>(true);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [repetitionsIsValid, setRepetitionsIsValid] = useState<boolean>(true);

  /**
   * This is used to save the data from input fields
   * @param id ID of the exercise, that this entry belongs to
   * @param maxWeight Maximum weight from input field
   * @param repetitions Repetitions from input field
   */
  async function AddHistoryEntry(id: ExerciseId, maxWeight: number, repetitions: number) {
    await db.insert(exercising_history).values({
      exerciseId: id,
      maxWeight: maxWeight,
      repetitions: repetitions,
      date: new Date(),
    });
  }

  const [isDeleteExerciseModalVisible, setIsDeleteExerciseModalVisible] = useState<boolean>(false);
  const CloseDeleteExerciseModal = (result: DeleteExerciseModalResult) => {
    switch (result) {
      // The default case would be an unexpected value
      // I am most comfortable, if we just get kicked back to some safe-space :)
      default:
      case 'Exercise Deleted':
        // I flipped the order (so we navigate first and then hide the modal) because it seems smoother
        router.replace('/pr-tracker-home');
        setIsDeleteExerciseModalVisible(false);
        return;
      case 'Deletion Cancelled':
        setIsDeleteExerciseModalVisible(false);
        return;
    }
  };
  return (
    <>
      {/*I have to do the undefined check here, or else typescript does not get it...*/}
      {exercise === undefined ? (
        <GoBackIfNotExists />
      ) : (
        <>
          <Drawer.Screen
            options={{
              title: exercise.name,
              headerRight: () => (
                <Pressable className="m-4" onPress={() => setIsDeleteExerciseModalVisible(true)}>
                  <DeleteExerciseModal visible={isDeleteExerciseModalVisible} exercise={exercise} closeModal={CloseDeleteExerciseModal} />
                  <Feather name="trash-2" size={30} color="gray" />
                </Pressable>
              ),
            }}
          />
          <View className="h-full w-full bg-white p-4">
            {/* Exercise Inputs */}
            <View className="w-full flex-row gap-4">
              <View className="grow">
                <View className="flex flex-row items-center gap-2 p-2">
                  <MaterialCommunityIcons className="pt-0.5" name="weight" size={20} color="gray" />
                  <Text className="text-lg text-gray-500">Weight (kg)</Text>
                </View>
                <ExercisePageInput
                  displayPrecision={2}
                  numberChangedCallback={(newValue, isValid) => {
                    setMaxWeight(newValue);
                    setMaxWeightIsValid(isValid);
                  }}
                  unitText={'kg'}
                />
              </View>

              <View className="grow">
                <View className="flex flex-row items-center gap-2 p-2">
                  <Feather className="pt-0.5" name="repeat" size={20} color="gray" />
                  <Text className="text-lg text-gray-500">Repetitions</Text>
                </View>
                <ExercisePageInput
                  displayPrecision={0}
                  numberChangedCallback={(newValue, isValid) => {
                    setRepetitions(newValue);
                    setRepetitionsIsValid(isValid);
                  }}
                  unitText={repetitions === 1 ? 'rep' : 'reps'}
                />
              </View>
            </View>

            <Pressable
              disabled={!maxWeightIsValid || !repetitionsIsValid}
              className={`my-4 flex-row items-center justify-center gap-2 rounded-md bg-blue-500 p-2 transition-colors active:bg-blue-300 ${!maxWeightIsValid || !repetitionsIsValid ? 'opacity-70' : 'opacity-100'}`}
              onPress={async () => await AddHistoryEntry(exercise.id, maxWeight, repetitions)}>
              <Feather name="save" size={20} color="white" />
              <Text className="text-white">Save Progress</Text>
            </Pressable>

            <View className="h-0.5 bg-gray-500" />

            <ScrollView>
              {history.length > 0 && (
                <View className="w-full py-10">
                  <View className="mb-4 flex-row gap-2">
                    <AntDesign name="areachart" size={26} color="black" />
                    <Text className="text-2xl font-bold">Progress Graph</Text>
                  </View>
                  <ExerciseChart
                    maxWeightDataPoints={history.map(hist => hist.maxWeight)}
                    repetitionDataPoints={history.map(hist => hist.repetitions)}
                  />
                </View>
              )}

              {history.length > 0 && <ExerciseLog logEntries={history} />}
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
};

const GoBackIfNotExists = () => {
  const navigation = useNavigation();
  return (
    <>
      <Drawer.Screen options={{ title: 'Oops, an error happened here...' }} />
      <View className="flex h-full w-full items-center justify-center gap-20 bg-white">
        <View className="flex items-center">
          <Text className="text-2xl">It seems like we sent you to an Exercise,</Text>
          <Text className="text-2xl">that does not exist anymore</Text>
        </View>
        <Pressable
          className="rounded-md border-2 border-blue-600 bg-blue-600 p-2 active:bg-blue-400"
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer);
          }}>
          <Text className="text-xl font-semibold text-white">Select another exercise?</Text>
        </Pressable>
        <Pressable
          className="rounded-md border-2 border-gray-600 bg-gray-200 p-2 active:bg-blue-400"
          onPress={() => {
            router.replace('/pr-tracker-home');
          }}>
          <Text className="text-xl font-semibold text-gray-500">Go back to PR Tracker?</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ExerciseScreen;
