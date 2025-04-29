import { Text, View, ScrollView, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Exercise, GetLastHistoryEntry } from '@/model/Exercise';
import {
  exerciseStore$,
  NoExercise,
  CreatingExercise,
  SelectedExerciseType,
  Exercise_asSelected,
} from '@/model/ExerciseStore';
import { use$ } from '@legendapp/state/react';
import { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function PRTrackerScreen() {
  const exercises = use$(exerciseStore$.exercises);
  const selectedExercise: SelectedExerciseType = use$(exerciseStore$.selectedExercise);

  const lastHistoryDate: Date | null = use$(() => {
    const selectedExercise = exerciseStore$.selectedExercise.get();
    if (selectedExercise.kind !== 'Exercise') return null;

    const lastHistoryEntry = GetLastHistoryEntry(selectedExercise.exercise);

    return lastHistoryEntry?.date ?? null;
  });

  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);

  /**
   * Gets run when a button in the exercise list gets pushed
   * @param newSelectedExercise The new exercise that belonged to the pressed button
   */
  function OnSelectedExercise(newSelectedExercise: Exercise) {
    if (selectedExercise.kind !== 'Exercise' || selectedExercise.exercise.id !== newSelectedExercise.id) {
      exerciseStore$.selectedExercise.set(Exercise_asSelected(newSelectedExercise));
    } else {
      exerciseStore$.selectedExercise.set(NoExercise);
    }

    // Reset Inputs
    setMaxWeight(0);
    setRepetitions(0);
  }

  /**
   * Gets run when the "+"-button to create a new exercise gets pushed
   */
  function OnCreatingExercise() {
    exerciseStore$.selectedExercise.set(CreatingExercise);

    // Reset Inputs
    setMaxWeight(0);
    setRepetitions(0);
  }

  return (
    <View className="flex flex-row">
      <View className="bg-white m-2 p-4 rounded-xl w-fit">
        <View className="flex-row items-center space-x-1 mb-4">
          <MaterialCommunityIcons name="dumbbell" color="black" size={26} />
          <Text className="font-bold text-2xl">Exercises</Text>
        </View>

        <ScrollView className="w-fit">
          {exercises.map((exercise: Exercise) => {
            let isSelected: boolean =
              selectedExercise.kind === 'Exercise' && selectedExercise.exercise.id === exercise.id;

            return (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => OnSelectedExercise(exercise)}
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

      {selectedExercise.kind === 'Exercise' ? (
        <ScrollView className="bg-white m-2 p-4 rounded-xl ">
          <Text className="text-2xl font-bold text-blue-500">{selectedExercise.exercise.name}</Text>

          <View>
            {/*//Todo: Add icon*/}
            <Text className="text-lg text-blue-500">Maximum Weight (kg)</Text>
            <TextInput
              className="border-2 border-gray-400 rounded-md p-4 text-base"
              value={maxWeight.toString()}
              //todo: This will break. I need a proper Number input
              onChangeText={newVal => setMaxWeight(newVal as unknown as number)}
              keyboardType="numeric"
            />
          </View>

          <View>
            {/*//Todo: Add icon*/}
            <Text className="text-lg text-blue-500">Repetitions</Text>
            <TextInput
              className="border-2 border-gray-400 rounded-md p-4 text-base"
              //todo: This will break. I need a proper Number input
              value={repetitions.toString()}
              onChangeText={newVal => setRepetitions(newVal as unknown as number)}
              keyboardType="numeric"
            />
          </View>

          {lastHistoryDate !== null && (
            <Text className="text-blue-500">Last performed: {lastHistoryDate.toLocaleDateString()}</Text>
          )}

          {/*//Todo: Implement Save in Model*/}
          {/*<TouchableOpacity style={styles.saveButton} onPress={handleSave}>*/}
          {/*  <Text style={styles.saveButtonText}>Save Progress</Text>*/}
          {/*</TouchableOpacity>*/}

          {/*//Todo: Implement this after Saving is possible*/}
          {/*{exercise.history.length > 0 && (*/}
          {/*  <View style={styles.chartContainer}>*/}
          {/*    <Text style={styles.sectionTitle}>Progress Graph</Text>*/}
          {/*    <LineChart*/}
          {/*      data={chartData}*/}
          {/*      width={300}*/}
          {/*      height={200}*/}
          {/*      chartConfig={{*/}
          {/*        backgroundColor: '#ffffff',*/}
          {/*        backgroundGradientFrom: '#ffffff',*/}
          {/*        backgroundGradientTo: '#ffffff',*/}
          {/*        decimalPlaces: 0,*/}
          {/*        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,*/}
          {/*        style: {*/}
          {/*          borderRadius: 16,*/}
          {/*        },*/}
          {/*      }}*/}
          {/*      bezier*/}
          {/*      style={styles.chart}*/}
          {/*    />*/}

          {/*    <Text style={styles.sectionTitle}>History Log</Text>*/}
          {/*    {[...exercise.history].reverse().map((log, index) => (*/}
          {/*      <View key={index} style={styles.logItem}>*/}
          {/*        <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</Text>*/}
          {/*        <View style={styles.logValues}>*/}
          {/*          <Text style={styles.logWeight}>{log.maxWeight} kg</Text>*/}
          {/*          <Text style={styles.logReps}>{log.repetitions} reps</Text>*/}
          {/*        </View>*/}
          {/*      </View>*/}
          {/*    ))}*/}
          {/*  </View>*/}
          {/*)}*/}
        </ScrollView>
      ) : selectedExercise.kind === 'CreatingExercise' ? (
        <View className="flex-1 bg-gray-100 rounded-lg border-2 border-gray-300 justify-center items-center m-2">
          <Text className="text-gray-500">Exercise Creator will be here when its done :)</Text>
        </View>
      ) : (
        <View className="flex-1 bg-gray-100 rounded-lg border-2 border-gray-300 justify-center items-center text-gray-500 m-2">
          <Text className="text-gray-500">Select an Exercise to track your progress</Text>
        </View>
      )}
    </View>
  );
}
