import { Observable, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { CreateExercise, Exercise, GET_BUILTIN_EXERCISES } from '@/model/Exercise';

export interface ExerciseStore {
  exercises: Exercise[];
  selectedExerciseID: number | null;
  creatingExercise: boolean;
}

export const exerciseStore$: Observable<ExerciseStore> = observable(
  synced<ExerciseStore>({
    persist: {
      name: 'ExerciseStore',
      plugin: ObservablePersistMMKV,
    },
  })
);

/**
 * This Does all the necessary validation and stuff to make the store extracted from persistence usable
 * @param store The store that should be made usable
 */
export function ValidateAndPatch(store: Observable<ExerciseStore>) {
  store.exercises.set(GET_BUILTIN_EXERCISES());
  store.selectedExerciseID.set(store.exercises.peek()[0].id);
  return;

  // If exercises don't exist yet initialize them
  if (store.exercises.peek()) {
    store.exercises.set([]);
    store.selectedExerciseID.set(null);
    return;
  }

  const selectedIdPointsToValidEntry: boolean = store.exercises
    .peek()
    .some((ex, index, exercises) => ex.id === store.selectedExerciseID.peek());

  if (!selectedIdPointsToValidEntry) {
    store.selectedExerciseID.set(null);
  }
}

/**
 * An observable object that always represents the currently selected item
 */
export const SelectedItem$ = observable<Exercise | null>((): Exercise | null => {
  const selectedId = exerciseStore$.selectedExerciseID.get();
  if (!selectedId) return null;

  const maybeExercise = exerciseStore$.exercises.get().find(value => value.id === selectedId);
  return maybeExercise ?? null;
});

/**
 * Selects an item in exerciseStore$
 */
export const SelectItem = (id: number): void => {
  if (GetExerciseByID(id) === null) return;
  exerciseStore$.selectedExerciseID.set(id);
};

/**
 * Removes selected item in exerciseStore$
 */
export const DeSelectItem = (): void => {
  exerciseStore$.selectedExerciseID.set(null);
};

/**
 * Retrieves an exercise by ID
 * @param id The ID of the searched exercise
 */
export const GetExerciseByID = (id: number): Observable<Exercise> | null =>
  exerciseStore$.exercises.find(ex => ex.id.peek() === id) || null;

/**
 * Adds a HistoryEntry to an exercise
 * @param exerciseId Exercise that should get the new History Entry
 * @param maxKg Max KG-value for new HistoryEntry
 * @param reps Rep value for new HistoryEntry
 * @constructor
 */
export const AddHistoryEntry = (exerciseId: number, maxKg: number, reps: number) => {
  const exToEdit = GetExerciseByID(exerciseId);
  if (exToEdit === null) return;

  exToEdit.exerciseHistory.set([
    ...exToEdit.exerciseHistory.peek(),
    {
      date: new Date(),
      maxWeight: maxKg,
      repetitions: reps,
    },
  ]);
};

/**
 * Creates a new Exercise and adds it to the exerciseStore$<br/>
 * Also selects it in the process
 * @param name Name of the new Exercise
 */
export const AddNewExercise = (name: string): void => {
  const IDs = exerciseStore$.exercises.peek().map((ex: Exercise): number => ex.id);
  let newID = Math.max(...IDs) + 1;

  // Pin to default if something goes terribly wrong
  if (!newID) newID = 0;

  // Add exercise to the others
  exerciseStore$.exercises.push(CreateExercise(newID, name));
  // Mark it as selected
  SelectItem(newID);
};
