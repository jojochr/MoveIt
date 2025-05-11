import { Text, View, Pressable } from 'react-native';
import { router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { ExerciseId, exercises, exercising_history } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Drawer } from 'expo-router/drawer';
import { DrawerActions } from '@react-navigation/native';

const ExerciseScreen = () => {
  const db = drizzle(useSQLiteContext(), { schema });
  const router = useRouter();

  const { id: idFromParams } = useLocalSearchParams<{ id: string; rest: string[] }>();

  const id = parseInt(idFromParams);
  if (Number.isNaN(id)) {
    console.error(`Tried opening exercise with invalid ID: "${idFromParams}"`);
    router.back();
  }

  const exercise = db.query.exercises
    .findFirst({
      where: eq(exercises.id, id as ExerciseId),
    })
    .sync();

  const { data: history } = useLiveQuery(
    db.query.exercising_history.findMany({
      where: eq(exercising_history.exerciseId, id as ExerciseId),
      orderBy: (exercising_history, { desc }) => [desc(exercising_history.date)],
    })
  );

  if (exercise === undefined) {
    return <GoBackIfNotExists id={id} />;
  }

  return (
    <>
      <Drawer.Screen options={{ title: exercise.name }} />
      <View className="flex h-full w-full items-center justify-center bg-white p-4">
        <Text>Todo :)</Text>
      </View>
    </>
  );
};

const GoBackIfNotExists = ({ id }: { id: number }) => {
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
