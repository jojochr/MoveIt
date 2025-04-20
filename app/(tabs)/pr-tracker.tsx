import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Exercise, GET_BUILTIN_EXERCISES } from '@/model/Exercise';
import { exerciseStore$ } from '@/model/ExerciseStore';
import { use$ } from '@legendapp/state/react';
import { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PRTrackerScreen() {
  // Just now for debugging
  exerciseStore$.exercises.set(GET_BUILTIN_EXERCISES());

  const exercises = use$(exerciseStore$.exercises);
  const selectedExercise: Exercise | null = use$(exerciseStore$.selectedExercise);

  const [maxWeight, setMaxWeight] = useState(0);
  const [repetitions, setRepetitions] = useState(0);

  /**
   * Gets run when a button in the exercise list gets pushed
   * @param newSelectedExercise The new exercise that belonged to the pressed button
   */
  function OnSelectedExercise(newSelectedExercise: Exercise) {
    if (selectedExercise === null || selectedExercise?.id !== newSelectedExercise.id) {
      exerciseStore$.selectedExercise.set(newSelectedExercise);
    } else {
      exerciseStore$.selectedExercise.set(null);
    }

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
            let isSelected: boolean = selectedExercise?.id === exercise.id;

            return (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => OnSelectedExercise(exercise)}
                className={'rounded-md p-2 mb-2' + (isSelected ? ' bg-blue-500' : ' hover:bg-gray-100')}>
                <Text className={'text-lg ' + (isSelected ? 'text-white ' : 'text-black')}>{exercise.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {selectedExercise === null ? (
        <Text>Exercise was null</Text>
      ) : (
        <ScrollView className="bg-white m-2 p-4 rounded-xl ">
          <Text className="text-2xl font-bold text-blue-500">{selectedExercise.name}</Text>

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

          {selectedExercise.LastHistoryEntry !== null && (
            <Text className="text-blue-500">
              Last performed: {selectedExercise.LastHistoryEntry.date.toLocaleDateString()}
            </Text>
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
      )}
    </View>
  );
}
